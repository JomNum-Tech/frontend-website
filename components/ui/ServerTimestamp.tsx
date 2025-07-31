interface ServerTimestampProps {
  formattedTime: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function ServerTimestamp({ 
  formattedTime, 
  className = '', 
  prefix = '', 
  suffix = '' 
}: ServerTimestampProps) {
  return (
    <span className={className}>
      {prefix}{formattedTime}{suffix}
    </span>
  );
}

interface ServerCommentTimestampProps {
  formattedTime: string;
  className?: string;
}

export function ServerCommentTimestamp({ 
  formattedTime, 
  className = '' 
}: ServerCommentTimestampProps) {
  return (
    <span className={className}>
      {formattedTime}
    </span>
  );
}

interface ServerPostTimestampProps {
  createdFormatted: string;
  updatedFormatted?: string | null;
  isEdited?: boolean;
  showCreated?: boolean;
  showUpdated?: boolean;
  className?: string;
}

export function ServerPostTimestamp({ 
  createdFormatted,
  updatedFormatted,
  isEdited = false,
  showCreated = true,
  showUpdated = true,
  className = ''
}: ServerPostTimestampProps) {
  return (
    <span className={className}>
      {showCreated && `Created ${createdFormatted}`}
      {showCreated && showUpdated && isEdited && updatedFormatted && ' • '}
      {showUpdated && isEdited && updatedFormatted && `Updated ${updatedFormatted}`}
    </span>
  );
}