import { Prescription } from '../../services/prescriptionService';
import { format } from 'date-fns';

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
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{prescription.remedy_name}</h3>
          {prescription.potency && (
            <span className="inline-block px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full mt-1">
              {prescription.potency}
            </span>
          )}
        </div>
        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(prescription.id)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <span className="material-icons text-sm">edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(prescription.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                <span className="material-icons text-sm">delete</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Prescription Details */}
      <div className="space-y-2 text-sm">
        {prescription.dosage && (
          <div className="flex items-start gap-2">
            <span className="material-icons text-gray-400 text-sm">medication</span>
            <div>
              <span className="text-gray-500">Dosage:</span>
              <span className="ml-2 text-gray-900">{prescription.dosage}</span>
            </div>
          </div>
        )}

        {prescription.repetition && (
          <div className="flex items-start gap-2">
            <span className="material-icons text-gray-400 text-sm">schedule</span>
            <div>
              <span className="text-gray-500">Frequency:</span>
              <span className="ml-2 text-gray-900">{prescription.repetition}</span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2">
          <span className="material-icons text-gray-400 text-sm">calendar_today</span>
          <div>
            <span className="text-gray-500">Prescribed on:</span>
            <span className="ml-2 text-gray-900">
              {format(new Date(prescription.prescription_date), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        {prescription.follow_up_date && (
          <div className="flex items-start gap-2">
            <span className="material-icons text-gray-400 text-sm">event</span>
            <div>
              <span className="text-gray-500">Follow-up:</span>
              <span className="ml-2 text-gray-900">
                {format(new Date(prescription.follow_up_date), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        )}

        {prescription.instructions && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Instructions</p>
            <p className="text-sm text-gray-700">{prescription.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
