import React from 'react';
import { Clock, FileText, Hash, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface EditorStatsProps {
  wordCount: number;
  characterCount: number;
  readingTime: { minutes: number; text: string };
  maxCharacters?: number;
  isEditable?: boolean;
  className?: string;
}

export const EditorStats: React.FC<EditorStatsProps> = ({
  wordCount,
  characterCount,
  readingTime,
  maxCharacters,
  isEditable = true,
  className = '',
}) => {
  const hasLimit = typeof maxCharacters === 'number' && maxCharacters > 0;
  const remaining = hasLimit ? maxCharacters - characterCount : 0;
  const isAtLimit = hasLimit && remaining <= 0;
  const isNearLimit = hasLimit && !isAtLimit && characterCount >= maxCharacters * 0.9;

  return (
    <div className={`rte-stats ${className}`.trim()}>
      <div className="rte-stats-group">
        <div className="rte-stat">
          <FileText size={14} />
          <strong>{wordCount.toLocaleString()}</strong>
          <span>{wordCount === 1 ? 'word' : 'words'}</span>
        </div>
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
        <div className="rte-stat">
          <Clock size={14} />
          <span>{readingTime.text}</span>
        </div>
      </div>
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
    </div>
  );
};
