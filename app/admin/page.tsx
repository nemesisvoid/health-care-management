import { DataTable } from '@/components/table/DataTable';
import StatCard from '@/components/StatCard';
import { getRecentAppointmentsList } from '@/lib/actions/appointment.actions';
import Image from 'next/image';
import Link from 'next/link';
import { columns } from '@/components/table/columns';

const Admin = async () => {
  const appointments = await getRecentAppointmentsList();

  return (
    <div className='flex flex-col max-w-7xl mx-auto space-y-14'>
      <header className='admin-header'>
        <Link href='/'>
          <Image
            src='assets/icons/logo-full.svg'
            height={32}
            width={162}
            className='h-8 w-fit'
            alt='logo'
          />
        </Link>{' '}
        <p className='text-16-semi-bold'>Admin Dashboard</p>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>Welcome👋</h1>
          <p className='text-dark-700'>Start the day with managing new appointments</p>
        </section>

        <section className='admin-stat'>
          <StatCard
            type='appointments'
            count={appointments.scheduledCount}
            label='Schedule Appointments'
            icon='/assets/icons/appointments.svg'
          />
          <StatCard
            type='pending'
            count={appointments.pendingCount}
            label='Pending Appointments'
            icon='/assets/icons/pending.svg'
          />
          <StatCard
            type='cancelled'
            count={appointments.cancelledCount}
            label='Cancelled Appointments'
            icon='/assets/icons/cancelled.svg'
          />
        </section>

        <DataTable
          data={appointments.documents}
          columns={columns}
        />
      </main>
    </div>
  );
};

export default Admin;
