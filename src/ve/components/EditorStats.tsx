import React from 'react';
import { Clock, FileText, Hash, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { EditorStatsConfig } from '../types/editor';

export interface EditorStatsProps {
  wordCount: number;
  characterCount: number;
  readingTime: { minutes: number; text: string };
  maxCharacters?: number;
  isEditable?: boolean;
  className?: string;
  config?: boolean | EditorStatsConfig;
}

export function resolveStatsConfig(
  showStats?: boolean | EditorStatsConfig
): Required<EditorStatsConfig> | null {
  if (!showStats) return null;
  if (showStats === true) {
    return { words: true, characters: true, readingTime: true, status: true };
  }
  const config = {
    words: Boolean(showStats.words),
    characters: Boolean(showStats.characters),
    readingTime: Boolean(showStats.readingTime),
    status: Boolean(showStats.status),
  };
  if (!config.words && !config.characters && !config.readingTime && !config.status) {
    return null;
  }
  return config;
}

export const EditorStats: React.FC<EditorStatsProps> = ({
  wordCount,
  characterCount,
  readingTime,
  maxCharacters,
  isEditable = true,
  className = '',
  config = true,
}) => {
  const resolved = resolveStatsConfig(config);
  if (!resolved) return null;

  const hasLimit = typeof maxCharacters === 'number' && maxCharacters > 0;
  const remaining = hasLimit ? maxCharacters - characterCount : 0;
  const isAtLimit = hasLimit && remaining <= 0;
  const isNearLimit = hasLimit && !isAtLimit && characterCount >= maxCharacters * 0.9;
  const showCounts = resolved.words || resolved.characters || resolved.readingTime;

  return (
    <div className={`rte-stats ${className}`.trim()}>
      {showCounts && (
        <div className="rte-stats-group">
          {resolved.words && (
            <div className="rte-stat">
              <FileText size={14} />
              <strong>{wordCount.toLocaleString()}</strong>
              <span>{wordCount === 1 ? 'word' : 'words'}</span>
            </div>
          )}
          {resolved.characters && (
            <div
              className={`rte-stat ${isAtLimit ? 'is-over' : isNearLimit ? 'is-warn' : ''}`}
              aria-live="polite"
            >
              <Hash size={14} />
              <strong>{characterCount.toLocaleString()}</strong>
              {hasLimit ? (
                <span>/ {maxCharacters.toLocaleString()} chars</span>
              ) : (
                <span>{characterCount === 1 ? 'character' : 'characters'}</span>
              )}
            </div>
          )}
          {resolved.readingTime && (
            <div className="rte-stat">
              <Clock size={14} />
              <span>{readingTime.text}</span>
            </div>
          )}
        </div>
      )}
      {resolved.status && (
        <div className="rte-stat">
          {isAtLimit ? (
            <>
              <AlertTriangle size={12} />
              <span>
                {remaining < 0
                  ? `${Math.abs(remaining).toLocaleString()} over limit — delete text to continue`
                  : 'Limit reached — delete text to continue'}
              </span>
            </>
          ) : hasLimit ? (
            <>
              <CheckCircle2 size={12} />
              <span>{remaining.toLocaleString()} characters remaining</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={12} />
              <span>{isEditable ? 'Ready to write' : 'Read only mode'}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
