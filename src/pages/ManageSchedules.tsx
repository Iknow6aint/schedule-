import { useEffect, useState } from 'react';
import { Search, Filter, Trash2, Edit2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { schedulesApi } from '../services/api';
import { Schedule } from '../types/types';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Mock data - replace with actual API calls


function ManageSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch = schedule.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });



  // Fetch schedules from the API
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await schedulesApi.getAll();
const formattedSchedules = response.data.map((schedule: Schedule) => ({
          ...schedule,
          dispatchDate: format(new Date(schedule.dispatchDate), 'yyyy-MM-dd'),
          deliveryDate: format(new Date(schedule.deliveryDate), 'yyyy-MM-dd'),
        }));
        console.log(schedules);
        
        setSchedules(formattedSchedules);        
      } catch (error) {
        toast.error('Failed to fetch schedules:',);
        console.log(error);
        
        alert('Could not load schedules. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);


  const handleDelete = async (id: number) => {
    // TODO: Implement delete functionality
    try {
      await schedulesApi.delete(id); // Call the API
      setSchedules((prev) => prev.filter((schedule:Schedule) => schedule._id !== id)); // Update the local state
      console.log('Deleted schedule with ID:', id);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Failed to delete the schedule. Please try again.');
    }
    console.log('Delete schedule:', id);
  };

  // Handle edit functionality
  const handleEdit = (id: number) => {
    navigate(`/edit-schedule/${id}`);
  };

  if (isLoading) {
    return <p>Loading schedules...</p>;
  }
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Manage Schedules
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by customer name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-64">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSchedules.map((schedule) => (
                        <tr key={schedule._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {schedule.customerName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              Dispatch: {schedule.dispatchDate}
                            </div>
                            <div className="text-sm text-gray-500">
                              Delivery: {schedule.deliveryDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{schedule.phone}</div>
                            <div className="text-sm text-gray-500">{schedule.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={schedule.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {schedule.notes}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-3 justify-end">
                              <button
                                onClick={() => handleEdit(schedule._id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(schedule._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSchedules;