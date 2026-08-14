import React from 'react';
import { Clock, FileText, Hash, CheckCircle2 } from 'lucide-react';

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
  const isNearLimit = maxCharacters ? characterCount >= maxCharacters * 0.9 : false;
  const isOverLimit = maxCharacters ? characterCount > maxCharacters : false;

  return (
    <div
      className={`
        flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs border-t
        border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400
        ${className}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Words */}
        <div className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {wordCount.toLocaleString()}
          </span>
          <span>{wordCount === 1 ? 'word' : 'words'}</span>
        </div>

        {/* Characters */}
        <div className="flex items-center gap-1">
          <Hash className="w-3.5 h-3.5 text-slate-400" />
          <span
            className={`font-medium ${
              isOverLimit
                ? 'text-red-500 font-bold'
                : isNearLimit
                ? 'text-amber-500 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {characterCount.toLocaleString()}
          </span>
          {maxCharacters ? (
            <span className="text-slate-400">/ {maxCharacters.toLocaleString()} chars</span>
          ) : (
            <span>{characterCount === 1 ? 'character' : 'characters'}</span>
          )}
        </div>

        {/* Reading Time */}
        <div className="hidden sm:flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{readingTime.text}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>{isEditable ? 'Ready to write' : 'Read only mode'}</span>
        </div>
      </div>
    </div>
  );
};
