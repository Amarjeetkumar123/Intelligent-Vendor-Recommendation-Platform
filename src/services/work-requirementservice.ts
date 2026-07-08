import { Request, Response, NextFunction } from 'express';
import {
    saveWorkRequirement,
    getWorkRequirements,
    getWorkRequirementById,
    updateWorkRequirement,
    deleteWorkRequirement,
} from '../dbhelper/work-requirement.dao.js';
import { WorkRequirement } from '../models/index.js';
import { getVendors } from '../dbhelper/vendor.dao.js';
import { getVendorDocuments } from '../dbhelper/vendor-document.dao.js';

// ─── CREATE ───────────────────────────────────────────────────────────────────
// POST /work-requirements

export const createWorkRequirement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            work_code, title, description, category_id, city, state,
            estimated_value, priority, expected_start_date, expected_end_date, created_by,
        }: WorkRequirement = req.body;
        const workReq = await saveWorkRequirement({
            work_code, title, description, category_id, city, state,
            estimated_value, priority, expected_start_date, expected_end_date, created_by,
        });
        res.status(201).json({ success: true, data: workReq });
    } catch (error) {
        next(error);
    }
};

// ─── READ ALL (dynamic filters via body) ──────────────────────────────────────
// POST /work-requirements/query

export const queryWorkRequirements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters: WorkRequirement = req.body ?? {};
        const workReqs = await getWorkRequirements(filters);
        res.status(200).json({ success: true, count: workReqs.length, data: workReqs });
    } catch (error) {
        next(error);
    }
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
// GET /work-requirements/:id

export const queryWorkRequirementById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid work requirement id' });
            return;
        }
        const workReq = await getWorkRequirementById(id);
        if (!workReq) {
            res.status(404).json({ success: false, message: `Work requirement with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: workReq });
    } catch (error) {
        next(error);
    }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// PUT /work-requirements/:id

export const updateWorkRequirementById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid work requirement id' });
            return;
        }
        const reqData: WorkRequirement = req.body;
        const updated = await updateWorkRequirement(id, reqData);
        if (!updated) {
            res.status(404).json({ success: false, message: `Work requirement with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
// DELETE /work-requirements/:id

export const deleteWorkRequirementById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Invalid work requirement id' });
            return;
        }
        const deleted = await deleteWorkRequirement(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: `Work requirement with id ${id} not found` });
            return;
        }
        res.status(200).json({ success: true, message: 'Work requirement deleted successfully', data: deleted });
    } catch (error) {
        next(error);
    }
};


export const recommendVendors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const requirementId = parseInt(String(req.params.id), 10);
        if (isNaN(requirementId)) {
            res.status(400).json({ success: false, message: 'Invalid work requirement id' });
            return;
        }

        // 1. Fetch work requirement
        const workRequirement = await getWorkRequirementById(requirementId);
        if (!workRequirement) {
            res.status(404).json({ success: false, message: `Work requirement with id ${requirementId} not found` });
            return;
        }

        // 2. Fetch candidate vendors (same category, status ACTIVE)
        const vendors = await getVendors({
            category_id: workRequirement.category_id,
            vendor_status: 'ACTIVE',
        });

        if (!vendors || vendors.length === 0) {
            res.status(200).json({
                success: true,
                count: 0,
                summaries: {
                    aiRecommendationSummary: 'No active vendors available for this category.',
                    vendorComparisonSummary: 'No comparison can be conducted as there are no registered active vendors under this category.'
                },
                data: []
            });
            return;
        }

        const recommendations: any[] = [];
        const now = new Date();

        for (const vendor of vendors) {
            if (!vendor.id) continue;

            // 3. Fetch vendor documents
            const docs = await getVendorDocuments({ vendor_id: vendor.id });

            // Rule: if document missing -> reject
            if (!docs || docs.length === 0) {
                continue;
            }

            // Rule: if expired or unverified -> reject
            let hasInvalidDoc = false;
            for (const doc of docs) {
                if (doc.verified !== true) {
                    hasInvalidDoc = true;
                    break;
                }
                if (doc.expiry_date) {
                    const expiryDate = new Date(doc.expiry_date);
                    if (expiryDate < now) {
                        hasInvalidDoc = true;
                        break;
                    }
                }
            }

            if (hasInvalidDoc) {
                continue;
            }

            // 4. Calculate Score
            // Rating Score (40% weight) -> (rating / 5) * 40
            const rating = Number(vendor.rating) || 0;
            const ratingScore = parseFloat(((rating / 5) * 40).toFixed(2));

            // Local Match Score (30% weight)
            let localScore = 0;
            const reqCity = workRequirement.city?.trim().toLowerCase();
            const venCity = vendor.city?.trim().toLowerCase();
            const reqState = workRequirement.state?.trim().toLowerCase();
            const venState = vendor.state?.trim().toLowerCase();

            let locationMatchType = 'NONE';
            if (reqCity && venCity && reqCity === venCity) {
                localScore = 30;
                locationMatchType = 'CITY';
            } else if (reqState && venState && reqState === venState) {
                localScore = 15;
                locationMatchType = 'STATE';
            }

            // Document Validity Score (30% weight)
            const docScore = 30;

            const totalScore = parseFloat((ratingScore + localScore + docScore).toFixed(2));

            // 5. Build Reasons, Risk Summary, and Compliance Observations
            const reasons: string[] = [];
            let riskLevel = 'LOW';
            let riskSummary = '';
            let complianceObservations = '';

            // Reasons based on score components
            if (rating >= 4.5) {
                reasons.push(`Highly rated service provider with an excellent rating of ${rating}/5.`);
            } else if (rating >= 3.5) {
                reasons.push(`Established provider with a solid rating of ${rating}/5.`);
            } else {
                reasons.push(`Moderate customer feedback rating of ${rating}/5.`);
            }

            if (locationMatchType === 'CITY') {
                reasons.push(`Perfect local match. Operating in the same city (${vendor.city}) as the work requirement.`);
            } else if (locationMatchType === 'STATE') {
                reasons.push(`Regional match. Operating in the same state (${vendor.state}) as the work requirement.`);
            } else {
                reasons.push(`Out-of-region provider based in ${vendor.city || 'unknown city'}, ${vendor.state || 'unknown state'}.`);
            }

            reasons.push(`Fully compliant and verified documentation.`);

            // Risk Summary based on rating and location match
            if (rating >= 4.5 && locationMatchType === 'CITY') {
                riskLevel = 'LOW';
                riskSummary = 'Exceptional track record and local proximity minimize operational risks.';
            } else if (rating >= 3.8) {
                riskLevel = 'LOW';
                riskSummary = 'Low risk. Reliable rating and verified compliance status.';
            } else {
                riskLevel = 'MEDIUM';
                riskSummary = 'Moderate risk. Low customer rating or distance might lead to slight coordination overhead.';
            }

            // Compliance Observations
            const docCount = docs.length;
            complianceObservations = `100% Compliant. All ${docCount} uploaded document(s) are active, verified, and unexpired.`;

            recommendations.push({
                vendor: {
                    id: vendor.id,
                    name: vendor.name,
                    vendor_type: vendor.vendor_type,
                    rating: vendor.rating,
                    city: vendor.city,
                    state: vendor.state,
                },
                scores: {
                    ratingScore,
                    localScore,
                    docScore,
                    totalScore,
                },
                evaluation: {
                    reasons,
                    risk: {
                        level: riskLevel,
                        summary: riskSummary,
                    },
                    complianceObservations,
                }
            });
        }

        // 6. Sort recommendations by totalScore descending
        recommendations.sort((a, b) => b.scores.totalScore - a.scores.totalScore);

        // 7. Inject Rank values
        recommendations.forEach((item, index) => {
            item.rank = index + 1;
        });

        // 8. Generate AI recommendation summary & comparison summary
        let aiRecommendationSummary = '';
        let vendorComparisonSummary = '';

        if (recommendations.length > 0) {
            const topVendor = recommendations[0];
            const topName = topVendor.vendor.name;
            const topScore = topVendor.scores.totalScore;
            
            aiRecommendationSummary = `We strongly recommend '${topName}' as the primary vendor choice for this requirement. `;
            aiRecommendationSummary += `They earned the highest score of ${topScore}/100, driven by their rating of ${topVendor.vendor.rating}/5 `;
            if (topVendor.scores.localScore === 30) {
                aiRecommendationSummary += `and a perfect local match operating directly out of ${topVendor.vendor.city || 'the target city'}.`;
            } else if (topVendor.scores.localScore === 15) {
                aiRecommendationSummary += `and a matching state-level presence in ${topVendor.vendor.state || 'the target state'}.`;
            } else {
                aiRecommendationSummary += `coupled with fully validated safety and compliance credentials.`;
            }

            if (recommendations.length > 1) {
                const runnerUp = recommendations[1];
                vendorComparisonSummary = `Compared ${recommendations.length} matching vendors for this task. '${topName}' (Rank 1, Score: ${topScore}) is the leading option, `;
                vendorComparisonSummary += `followed by '${runnerUp.vendor.name}' (Rank 2, Score: ${runnerUp.scores.totalScore}). `;
                if (topVendor.scores.localScore > runnerUp.scores.localScore) {
                    vendorComparisonSummary += `'${topName}' has a distinct advantage due to closer geographical proximity.`;
                } else if (Number(topVendor.vendor.rating) > Number(runnerUp.vendor.rating)) {
                    vendorComparisonSummary += `'${topName}' is preferred due to higher service ratings.`;
                } else {
                    vendorComparisonSummary += `'${topName}' leads slightly on overall aggregated metrics.`;
                }
            } else {
                vendorComparisonSummary = `Only one matching vendor ('${topName}') met all safety, location, and verified documentation standards. No alternative options are available at this time.`;
            }
        } else {
            aiRecommendationSummary = 'No vendors met the combined criteria of active status and verified documentation.';
            vendorComparisonSummary = 'All potential candidates were rejected due to either missing or expired mandatory compliance documentation.';
        }

        res.status(200).json({
            success: true,
            count: recommendations.length,
            summaries: {
                aiRecommendationSummary,
                vendorComparisonSummary,
            },
            data: recommendations,
        });
    } catch (error) {
        next(error);
    }
};