import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { notificationsApi } from '../services/api';
import toast from 'react-hot-toast';

// Types for the notifications page
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  lastDelivery: string;
}

interface NotificationHistory {
  id: string;
  customerName: string;
  message: string;
  channel: 'email' | 'sms' | 'whatsapp';
  sentAt: string;
  status: 'sent' | 'failed';
}

function Notifications() {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');

  // Fetch customers who have ordered before
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await notificationsApi.getCustomers();
      console.log(response);
      
      return response.data; // Ensure we're working with the correct data format
    },
    initialData: [],
  });

  const customers = Array.isArray(customersData) ? customersData : [];

 // Fetch notification history
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery<NotificationHistory[]>({
    queryKey: ['notificationHistory'],
    queryFn: async () => {
      const response = await notificationsApi.getHistory();
      return response.data;
    },
    initialData: [],
  });

  const history = Array.isArray(historyData) ? historyData : [];

  // Automatically fetch notification history on mount
  useEffect(() => {
    refetchHistory();
  }, [refetchHistory]);
  // Mutation for sending notifications
  const sendNotification = useMutation({
    mutationFn: (data: { customerIds: string[]; message: string; channel: 'email' | 'sms' | 'whatsapp' }) =>
      notificationsApi.sendCustomNotification(data),
    onSuccess: () => {
      toast.success('Notification sent successfully');
      setSelectedCustomers([]);
      setMessage('');
    },
    onError: () => {
      toast.error('Failed to send notification');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomers.length) {
      toast.error('Please select at least one customer');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    sendNotification.mutate({ customerIds: selectedCustomers, message, channel });
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Send Notifications
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer Selection and Message Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Customers
              </label>
              <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {isLoadingCustomers ? (
                  <div className="p-4 text-center text-gray-500">Loading customers...</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {customers.map((customer: Customer) => (
                      <label
                        key={customer._id}
                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedCustomers.includes(customer._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomers([...selectedCustomers, customer._id]);
                            } else {
                              setSelectedCustomers(selectedCustomers.filter(id => id !== customer._id));
                            }
                          }}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">Last delivery: {customer.lastDelivery}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notification Channel
              </label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                    channel === 'email'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                    channel === 'sms'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  SMS
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                    channel === 'whatsapp'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  WhatsApp
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  rows={4}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here..."
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={sendNotification.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {sendNotification.isPending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Notification History */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification History</h3>
          {isLoadingHistory ? (
            <div className="text-center text-gray-500">Loading history...</div>
          ) : (
            <div className="space-y-4">
              {history.map((notification: NotificationHistory) => (
                <div
                  key={notification.id}
                  className="border-l-4 border-indigo-400 bg-indigo-50 p-4 rounded-r-md"
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-indigo-900">
                      To: {notification.customerName}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      notification.status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {notification.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-indigo-700">{notification.message}</p>
                  <div className="mt-2 flex justify-between text-xs text-indigo-500">
                    <span>Via: {notification.channel}</span>
                    <span>{new Date(notification.sentAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;