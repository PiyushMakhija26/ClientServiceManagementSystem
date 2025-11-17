'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PENDING_REQUESTS = [
  { id: 1, title: 'Water Supply Issue', status: 'raised', description: 'Low water pressure in residential area.' },
  { id: 2, title: 'Street Light Repair', status: 'in_progress', description: 'Street light on 5th Avenue not working.' },
];

export default function UpdateStatusPage() {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(PENDING_REQUESTS[0].id);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedRequest = PENDING_REQUESTS.find(r => r.id === selectedRequestId);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setNewStatus('');
      setMessage('');
      setSubmitted(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'raised': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Update Request Status</h1>
        <p className="text-gray-600 mt-2">Update the status of service requests and provide feedback to citizens.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Request List */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {PENDING_REQUESTS.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No pending requests</p>
              ) : (
                <div className="space-y-2">
                  {PENDING_REQUESTS.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequestId(req.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        selectedRequestId === req.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-900 truncate">{req.title}</p>
                      <span className={`inline-block text-xs mt-1 px-2 py-1 rounded-full font-semibold ${getStatusColor(req.status)}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{selectedRequest.title}</CardTitle>
                <CardDescription>Current status: {selectedRequest.status.replace('_', ' ')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateStatus} className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm">{selectedRequest.description}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 font-semibold">Update Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="border-gray-200 bg-white">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raised">Raised</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 font-semibold">Message for Citizen</Label>
                    <textarea
                      id="message"
                      placeholder="Provide updates or ask for clarification..."
                      className="w-full min-h-24 px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 font-sans"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <Button type="submit" disabled={!newStatus} className="w-full bg-blue-600 hover:bg-blue-700">
                    {submitted ? 'Status Updated!' : 'Update Status'}
                  </Button>

                  {submitted && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
                      Request status updated and notification sent to citizen.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center min-h-96 border-gray-200">
              <p className="text-gray-600">Select a request to update</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
