// src/lib/stores/departmentStore.ts
import { writable } from 'svelte/store';

interface Department {
  name: string;
  jobs: string[];
}

const departmentJobs: Department[] = [
  {
    name: 'Management Department',
    jobs: [
      'CEO (Chief Executive Officer)',
      'COO (Chief Operating Officer)'
    ]
  },
  {
    name: 'Development Department',
    jobs: [
      'Lead Developer',
      'Frontend Developer',
      'Backend Developer'
    ]
  },
  {
    name: 'Design Department',
    jobs: [
      'UI/UX Designer',
      'Graphic Designer'
    ]
  },
  {
    name: 'Marketing Department',
    jobs: [
      'Marketing Manager',
      'Social Media Specialist',
      'Content Writer'
    ]
  },
  {
    name: 'Sales & Customer Support',
    jobs: [
      'Sales Representative',
      'Customer Support Representative'
    ]
  },
  {
    name: 'HR & Admin',
    jobs: [
      'HR Officer',
      'Admin Assistant'
    ]
  }
];

export const departments = writable(departmentJobs);
