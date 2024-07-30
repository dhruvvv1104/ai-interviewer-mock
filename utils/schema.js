import { serial, text, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  ExecDepartment: varchar('ExecDepartment').notNull(),
  WhyGDSC: varchar('WhyGDSC'),
  PastExperiences: varchar('PastExperiences').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt').notNull(),
  mockId: varchar('mockId').notNull()
})

export const UserAnswer = pgTable('UserAnswer',{
  id:serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(),
  question: varchar('question').notNull(),
  correctAns:text('correctAns'),
  userAns:text('userAns'),
  feedback:text('feedback'),
  rating:varchar('rating'),
  userEmail:varchar('userEmail'),
  createdAt: varchar('createdAt'),

})
