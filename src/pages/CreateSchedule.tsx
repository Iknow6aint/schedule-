import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import DateInput from '../components/DateInput';
import { format } from 'date-fns';
import { schedulesApi } from '../services/api';
import toast from 'react-hot-toast';

const scheduleSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  dispatchDate: z.string().min(1, 'Dispatch date is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  phone: z.string().min(1, 'Phone number is required')
    .regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  notes: z.string().optional(),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

function CreateSchedule() {
  const navigate = useNavigate();
  const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
  watch,
} = useForm<ScheduleForm>({
  resolver: zodResolver(scheduleSchema),
});

const dispatchDate = watch('dispatchDate');
const today = format(new Date(), 'yyyy-MM-dd');

const onSubmit = async (data: ScheduleForm) => {
  try {
    // Format the dates as required by the backend
    const formattedData: ScheduleForm = {
      ...data,
      dispatchDate: format(new Date(data.dispatchDate), 'yyyy-MM-dd'),
      deliveryDate: format(new Date(data.deliveryDate), 'yyyy-MM-dd'),
    };

    console.log(formattedData);
    
    // Call the API to create the schedule
    const response = await schedulesApi.create(formattedData);

    // Navigate to the schedules management page upon successful creation
    toast.success('Schedule created successfully:', response.data);
    navigate('/manage-schedules');
  } catch (error:any) {
    console.error('Failed to create schedule:', error);

    // Check if the error is from Axios and display a user-friendly message
    if (error.response?.data?.message) {
      toast.error(`Error: ${error.response.data.message}`);
    } else {
      toast.error('An unexpected error occurred while creating the schedule.');
    }
  }
};



  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create New Schedule
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                {...register('customerName')}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
              )}
            </div>
          </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <DateInput
                    id="dispatchDate"
                    label="Dispatch Date"
                    value={dispatchDate || ''}
                    onChange={(value) => {
                    console.log('Dispatch Date selected:', value); // Log the selected value
                    setValue('dispatchDate', value, { shouldValidate: true }); // Explicitly update form state and trigger validation
                    }}
                    min={today}
                    required
                    error={errors.dispatchDate?.message}
                />

                <DateInput
                    id="deliveryDate"
                    label="Delivery Date"
                    value={watch('deliveryDate') || ''}
                    onChange={(value) => {
                    console.log('Delivery Date selected:', value); // Log the selected value
                    setValue('deliveryDate', value, { shouldValidate: true }); // Explicitly update form state and trigger validation
                    }}
                    min={dispatchDate || today} // Ensure delivery date is not earlier than dispatch date
                    required
                    error={errors.deliveryDate?.message}
                />
            </div>



          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  {...register('phone')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  {...register('email')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Delivery Notes (Optional)
            </label>
            <div className="mt-1">
              <textarea
                {...register('notes')}
                rows={4}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Additional instructions or notes..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSchedule;