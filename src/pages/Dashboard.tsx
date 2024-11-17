import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Schedule, ScheduleStats } from '../types/types.ts'; // Import your types
import { 
  Clock, 
  Package,
  CheckCircle
} from 'lucide-react';
import { schedulesApi } from '../services/api.ts';
import { format } from 'date-fns';

// Mock data - replace with actual API calls
const mockStats = {
  total: 156,
  active: 142,
  completed: 91,
};

function Dashboard() {
  const [stats, setStats] = useState<ScheduleStats>(mockStats);
  const [recentSchedules, setRecentSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await schedulesApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    async function fetchRecentSchedules() {
      try {
        const response = await schedulesApi.getAll();
        const formattedSchedules = response.data.map((schedule: Schedule) => ({
          ...schedule,
          dispatchDate: format(new Date(schedule.dispatchDate), 'yyyy-MM-dd'),
          deliveryDate: format(new Date(schedule.deliveryDate), 'yyyy-MM-dd'),
        }));
        setRecentSchedules(formattedSchedules);
      } catch (error) {
        console.error('Error fetching recent schedules:', error);
      }
    }

    fetchStats();
    fetchRecentSchedules();
  }, []);

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/create-schedule"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Schedule
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-gray-400" />
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Reminders Scheduled
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Successful Deliveries
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.completed}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-yellow-400" />
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending Reminders
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.active}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Schedules
          </h3>
        </div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dispatch Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentSchedules.map((schedule) => (
                      <tr key={schedule._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {schedule.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.dispatchDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.deliveryDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.status}
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
  );
}

export default Dashboard;
