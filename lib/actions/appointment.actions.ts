'use server';

import { formatDateTime } from '../utils';

import { ID, Query } from 'node-appwrite';
import { APPOINTMENT_COLLECTION_ID, database, DATABASE_ID, messaging } from '../appwrite.config';
import { parseStringify } from '../utils';
import { Appointment } from '@/types/appwrite.types';
import { revalidatePath } from 'next/cache';

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const newAppointment = await database.createDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, ID.unique(), appointment);

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await database.getDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId);
    return parseStringify(appointment);
  } catch (error) {}
};

export const getRecentAppointmentsList = async () => {
  try {
    const appointments = await database.listDocuments(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, [Query.orderDesc('$createdAt')]);

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if (appointment.status === 'scheduled') {
        acc.scheduledCount += 1;
      } else if (appointment.status === 'pending') {
        acc.pendingCount += 1;
      } else if (appointment.status === 'cancelled') {
        acc.cancelledCount += 1;
      }
      return acc;
    }, initialCounts);

    const data = {
      ...counts,
      totalCount: appointments.total,
      documents: appointments.documents,
    };
    console.log(parseStringify(data));

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await database.updateDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId, appointment);

    if (!updatedAppointment) throw new Error();

    const smsMessage = `
      Hi this is CarePulse,
      ${
        type === 'schedule'
          ? `your appointment has been scheduled ${formatDateTime(appointment.schedule).dateTime} with Dr.${appointment.primaryPhysician}`
          : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
      }
    `;

    await sendSmsNotification(userId, smsMessage);

    revalidatePath('/admin');
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const sendSmsNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(ID.unique(), content, [], [userId]);

    return parseStringify(message);
  } catch (error) {
    console.log(error);
  }
};
