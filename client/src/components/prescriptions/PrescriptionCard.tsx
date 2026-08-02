import { Prescription } from '../../services/prescriptionService';
import { format } from 'date-fns';
import { Edit2, Trash2, Pill, Clock, Calendar } from 'lucide-react';
import { Badge, IconButton } from '../ui';

interface PrescriptionCardProps {
  prescription: Prescription;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export default function PrescriptionCard({
  prescription,
  onEdit,
  onDelete,
  showActions = true,
}: PrescriptionCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-semibold text-text">{prescription.remedy_name}</h3>
          {prescription.potency && (
            <div className="mt-1">
              <Badge variant="primary">{prescription.potency}</Badge>
            </div>
          )}
        </div>
        {showActions && (
          <div className="flex gap-1">
            {onEdit && (
              <IconButton
                icon={<Edit2 className="w-4 h-4 text-primary" />}
                aria-label="Edit prescription"
                variant="ghost"
                size="sm"
                onClick={() => onEdit(prescription.id)}
              />
            )}
            {onDelete && (
              <IconButton
                icon={<Trash2 className="w-4 h-4 text-danger" />}
                aria-label="Delete prescription"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(prescription.id)}
              />
            )}
          </div>
        )}
      </div>

      {/* Prescription Details */}
      <div className="space-y-2 text-sm">
        {prescription.dosage && (
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-text-muted shrink-0" />
            <div>
              <span className="text-text-muted">Dosage:</span>
              <span className="ml-2 font-medium text-text">{prescription.dosage}</span>
            </div>
          </div>
        )}

        {prescription.repetition && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted shrink-0" />
            <div>
              <span className="text-text-muted">Frequency:</span>
              <span className="ml-2 font-medium text-text">{prescription.repetition}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-muted shrink-0" />
          <div>
            <span className="text-text-muted">Prescribed on:</span>
            <span className="ml-2 font-medium text-text">
              {format(new Date(prescription.prescription_date), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        {prescription.follow_up_date && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <div>
              <span className="text-text-muted">Follow-up:</span>
              <span className="ml-2 font-medium text-primary-subtle-text">
                {format(new Date(prescription.follow_up_date), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        )}

        {prescription.instructions && (
          <div className="mt-3 p-3 bg-bg-subtle border border-border rounded-lg">
            <p className="text-xs text-text-subtle font-semibold mb-1">Instructions</p>
            <p className="text-sm text-text">{prescription.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
