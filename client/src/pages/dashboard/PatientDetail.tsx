import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';
import { useCaseRecordStore } from '../../store/caseRecordStore';
import { format } from 'date-fns';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPatient, fetchPatientById, isLoading: patientLoading } = usePatientStore();
  const { caseRecords, fetchCaseRecordsByPatient, isLoading: caseLoading } = useCaseRecordStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');

  useEffect(() => {
    if (id) {
      fetchPatientById(parseInt(id));
      fetchCaseRecordsByPatient(parseInt(id));
    }
  }, [id, fetchPatientById, fetchCaseRecordsByPatient]);

  if (patientLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading patient details...</div>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/patients')}
          className="text-teal-600 hover:text-teal-700 mb-4 flex items-center"
        >
          <span className="material-icons text-sm mr-1">arrow_back</span>
          Back to Patients
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentPatient.full_name}</h1>
            <p className="text-gray-600 mt-1">Case ID: {currentPatient.case_id}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/dashboard/patients/${id}/edit`)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <span className="material-icons text-sm">edit</span>
              Edit Patient
            </button>
            <button
              onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <span className="material-icons text-sm">add</span>
              New Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'timeline'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Case Timeline ({caseRecords.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-icons text-teal-600">person</span>
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-base font-medium text-gray-900">{currentPatient.age || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-base font-medium text-gray-900 capitalize">
                    {currentPatient.gender || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="text-base font-medium text-gray-900">{currentPatient.occupation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registered</p>
                  <p className="text-base font-medium text-gray-900">
                    {format(new Date(currentPatient.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-icons text-teal-600">contact_phone</span>
                Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-base font-medium text-gray-900">{currentPatient.contact_phone}</p>
                </div>
                {currentPatient.contact_email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-900">{currentPatient.contact_email}</p>
                  </div>
                )}
                {currentPatient.address && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-base font-medium text-gray-900">{currentPatient.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle & Emergency Contact */}
            {(currentPatient.lifestyle_habits ||
              currentPatient.emergency_contact ||
              currentPatient.emergency_phone) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="material-icons text-teal-600">info</span>
                  Additional Information
                </h2>
                <div className="space-y-3">
                  {currentPatient.lifestyle_habits && (
                    <div>
                      <p className="text-sm text-gray-500">Lifestyle Habits</p>
                      <p className="text-base font-medium text-gray-900">{currentPatient.lifestyle_habits}</p>
                    </div>
                  )}
                  {currentPatient.emergency_contact && (
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="text-base font-medium text-gray-900">
                        {currentPatient.emergency_contact}
                        {currentPatient.emergency_phone && ` - ${currentPatient.emergency_phone}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-teal-100">Total Consultations</span>
                  <span className="text-2xl font-bold">{caseRecords.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-teal-100">Last Visit</span>
                  <span className="text-sm font-medium">
                    {caseRecords.length > 0
                      ? format(new Date(caseRecords[0].consultation_date), 'MMM dd, yyyy')
                      : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Consultations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Consultations</h2>
              {caseLoading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : caseRecords.length === 0 ? (
                <p className="text-gray-500 text-sm">No consultations yet</p>
              ) : (
                <div className="space-y-3">
                  {caseRecords.slice(0, 3).map((record) => (
                    <div
                      key={record.id}
                      onClick={() => navigate(`/dashboard/case-records/${record.id}`)}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(record.consultation_date), 'MMM dd, yyyy')}
                      </p>
                      {record.diagnosis && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{record.diagnosis}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Consultation Timeline</h2>
          {caseLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Loading timeline...</p>
            </div>
          ) : caseRecords.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons text-6xl text-gray-300 mb-4">medical_services</span>
              <p className="text-gray-500 mb-4">No consultations yet</p>
              <button
                onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Add First Consultation
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {caseRecords.map((record, index) => (
                <div key={record.id} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-0">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-teal-500 border-4 border-white"></div>

                  {/* Record content */}
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {format(new Date(record.consultation_date), 'MMMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(record.consultation_date), 'hh:mm a')}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/dashboard/case-records/${record.id}`)}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                      >
                        View Details
                        <span className="material-icons text-sm">arrow_forward</span>
                      </button>
                    </div>

                    {/* Chief Complaints */}
                    {record.chief_complaints && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 font-medium">Chief Complaints</p>
                        <p className="text-sm text-gray-700">{record.chief_complaints}</p>
                      </div>
                    )}

                    {/* Diagnosis */}
                    {record.diagnosis && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 font-medium">Diagnosis</p>
                        <p className="text-sm text-gray-700">{record.diagnosis}</p>
                      </div>
                    )}

                    {/* Complaint Tags */}
                    {record.complaint_tags && record.complaint_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {record.complaint_tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
