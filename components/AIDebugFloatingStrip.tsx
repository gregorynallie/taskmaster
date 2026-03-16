import React, { useEffect, useState } from 'react';
import * as claudeService from '../services/claudeService';

export const AIDebugFloatingStrip: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [runtimeStats, setRuntimeStats] = useState(claudeService.getAIRuntimeStats());
    const [budgetSnapshot, setBudgetSnapshot] = useState(claudeService.getAIBudgetSnapshot());
    const [costEstimate, setCostEstimate] = useState(claudeService.getClaudeCostEstimateSnapshot());
    const [lastAction, setLastAction] = useState(claudeService.getLastAIActionSnapshot());

    useEffect(() => {
        const refresh = () => {
            setRuntimeStats(claudeService.getAIRuntimeStats());
            setBudgetSnapshot(claudeService.getAIBudgetSnapshot());
            setCostEstimate(claudeService.getClaudeCostEstimateSnapshot());
            setLastAction(claudeService.getLastAIActionSnapshot());
        };
        refresh();
        const intervalId = window.setInterval(refresh, 1000);
        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <div className="fixed top-[84px] left-1/2 -translate-x-1/2 z-30 w-[min(92vw,880px)] bg-surface/95 backdrop-blur border border-primary/40 rounded-themed shadow-themed px-3 py-2">
            <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-text-secondary">
                    <span className="font-semibold text-primary">AI Debug</span>
                    <span>Budget {budgetSnapshot.sessionRequestsConsumed}/{budgetSnapshot.sessionRequestBudget}</span>
                    <span>Rem {budgetSnapshot.remaining}</span>
                    <span>Q {budgetSnapshot.queueDepth}</span>
                    <span>Active {budgetSnapshot.activeRequests}</span>
                    <span>OK/Fail {runtimeStats.succeeded}/{runtimeStats.failed}</span>
                    <span>429 {runtimeStats.rateLimited}</span>
                    <span>Retry {runtimeStats.retries}</span>
                    <span>Cache H/M {runtimeStats.cacheHits}/{runtimeStats.cacheMisses}</span>
                    <span>Tiers L/S/H {runtimeStats.qualityTierLow}/{runtimeStats.qualityTierStandard}/{runtimeStats.qualityTierHigh}</span>
                    <span>Claude Tok In/Out/Total {runtimeStats.claudeInputTokens}/{runtimeStats.claudeOutputTokens}/{runtimeStats.claudeTotalTokens}</span>
                    <span>Claude Est ${costEstimate.estimatedTotalUSD.toFixed(4)}</span>
                    <span>Last {lastAction.feature}:{lastAction.status}</span>
                    <span>Last Tok {lastAction.inputTokens}/{lastAction.outputTokens}/{lastAction.totalTokens}</span>
                    <span>Last $ {lastAction.estimatedUSD.toFixed(5)}</span>
                </div>
                <button
                    onClick={onClose}
                    className="theme-hover text-text-secondary hover:text-text-primary text-base leading-none px-2"
                    aria-label="Hide AI debug strip"
                    title="Hide AI debug strip"
                >
                    ×
                </button>
            </div>
        </div>
    );
};
