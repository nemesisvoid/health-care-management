'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useState } from 'react';
import AppointmentForm from './forms/AppointmentForm';
import { Appointment } from '@/types/appwrite.types';

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
}: {
  type: 'schedule' | 'cancel';
  patientId: string;
  userId: string;
  appointment?: Appointment;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className={`capitalize ${type === 'schedule' && 'text-green-500'}`}>
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className='shad-dialog max-sm:max-w-[60%]'>
        <DialogHeader className='mb-4 space-y-3'>
          <DialogTitle className='capitalize'>{type} appointment</DialogTitle>
          <DialogDescription>Please fill the following details to {type} an appointment</DialogDescription>
        </DialogHeader>
        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
