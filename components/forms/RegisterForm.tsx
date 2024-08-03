'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl } from '@/components/ui/form';
import CustomFormField from '../CustomFormField';
import SubmitButton from '../SubmitButton';
import { PatientFormValidation } from '@/lib/validation';
import { createUser, registerPatient } from '@/lib/actions/patients.actions';
import { FormFieldTypes } from './PatientForm';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Doctors, genderOptions, IdentificationTypes, PatientFormDefaultValues } from '@/constants';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import FileUploader from '../FileUploader';

const RegisterForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: '',
      phone: '',
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], { type: values.identificationDocument[0].type });
      formData = new FormData();
      formData.append('blobfile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      const patient = await registerPatient(patientData);
      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-12 flex-1'>
        <section className='space-y-4'>
          <h1 className='header'>Welcome 😄</h1>
          <p className='text-dark-700'>Let us know more about yourself.</p>
        </section>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Personal Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldTypes.INPUT}
          control={form.control}
          name='name'
          label='Full name'
          placeholder=''
          iconSrc='/assets/icons/user.svg'
          iconAlt=''
        />

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldTypes.INPUT}
            control={form.control}
            name='email'
            label='Email'
            placeholder=''
            iconSrc='/assets/icons/email.svg'
            iconAlt=''
          />
          <CustomFormField
            fieldType={FormFieldTypes.PHONE_INPUT}
            control={form.control}
            name='phone'
            label='Phone Number'
            placeholder=''
            iconSrc='/assets/icons/email.svg'
            iconAlt=''
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldTypes.DATE_PICKER}
            control={form.control}
            name='birthDate'
            label='Date of Birth'
            placeholder='john@example.com'
            iconSrc='/assets/icons/email.svg'
            iconAlt=''
          />

          <CustomFormField
            fieldType={FormFieldTypes.SKELETON}
            control={form.control}
            name='gender'
            label='Gender'
            placeholder='(343) 567-909'
            iconSrc='/assets/icons/email.svg'
            iconAlt=''
            renderSkeleton={field => (
              <FormControl>
                <RadioGroup
                  className='flex h-11 gap-6 xl:justify-between'
                  onValueChange={field.change}
                  defaultValue={field.value}>
                  {genderOptions.map(option => (
                    <div
                      key={option}
                      className='radio-group'>
                      <RadioGroupItem
                        value={option}
                        id={option}
                      />
                      <Label
                        htmlFor={option}
                        className='cursor-pointer'>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldTypes.INPUT}
            control={form.control}
            name='address'
            label='Address'
            placeholder='12th Street, Miami'
          />
          <CustomFormField
            fieldType={FormFieldTypes.INPUT}
            control={form.control}
            name='occupation'
            placeholder='Engineer'
            label='Occupation'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldTypes.INPUT}
            control={form.control}
            name='emergencyContactName'
            label='Emergency Contact Name'
            placeholder='Guardian name'
          />
          <CustomFormField
            fieldType={FormFieldTypes.PHONE_INPUT}
            control={form.control}
            name='emergencyContactNumber'
            label='Emergency Contact Number'
          />
        </div>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Medical Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldTypes.SELECT}
          control={form.control}
          name='primaryPhysician'
          label='Primary Physician'>
          {Doctors.map(doctor => (
            <SelectItem
              key={doctor.name}
              value={doctor.name}>
              <div className='flex items-center gap-2 cursor-pointer'>
                <Image
                  src={doctor.image}
                  height={32}
                  width={32}
                  alt={doctor.name}
                  className='rounded-full border border-dark-500'
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldTypes.INPUT}
            control={form.control}
            name='insuranceProvider'
            label='Insurance Provider'
            placeholder='BlueCross'
          />
          <CustomFormField
            fieldType={FormFieldTypes.INPUT}
            control={form.control}
            name='insurancePolicyNumber'
            label='Insurance Policy Number'
            placeholder='121ABEDA'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldTypes.TEXTAREA}
            control={form.control}
            name='allergies'
            label='Allergies (if any)'
            placeholder='Peanuts, Pollen, Fiber'
          />
          <CustomFormField
            fieldType={FormFieldTypes.TEXTAREA}
            control={form.control}
            name='currentMedication'
            label='Current Medication (if any)'
            placeholder=''
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldTypes.TEXTAREA}
            control={form.control}
            name='familyMedicalHistory'
            label='Family Medical History'
          />
          <CustomFormField
            fieldType={FormFieldTypes.TEXTAREA}
            control={form.control}
            name='pastMedicalHistory'
            label='Past Medical History'
            placeholder='sickle cell, ulcer'
          />
        </div>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldTypes.SELECT}
          control={form.control}
          name='identificationType'
          label='Identification Type'
          placeholder='select identification type'>
          {IdentificationTypes.map(type => (
            <SelectItem
              key={type}
              value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldTypes.INPUT}
          control={form.control}
          name='identificationNumber'
          label='Identification Number'
          placeholder='12133113'
        />

        <CustomFormField
          fieldType={FormFieldTypes.SKELETON}
          control={form.control}
          name='identificationDocument'
          label='Scanned copy of identification document'
          renderSkeleton={field => (
            <FormControl>
              <FileUploader
                files={field.value}
                onChange={field.onChange}
              />
            </FormControl>
          )}
        />

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldTypes.CHECKBOX}
          control={form.control}
          name='treatmentConsent'
          label='I consent to treatment'
        />

        <CustomFormField
          fieldType={FormFieldTypes.CHECKBOX}
          control={form.control}
          name='disclosureConsent'
          label='I consent to disclosure of information'
        />

        <CustomFormField
          fieldType={FormFieldTypes.CHECKBOX}
          control={form.control}
          name='privacyConsent'
          label='I consent to privacy policy'
        />

        <SubmitButton isLoading={isLoading}>Get started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
