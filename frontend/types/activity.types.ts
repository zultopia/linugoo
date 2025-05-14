export interface BaseActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  image: any; // Changed from string to any to accept require() images
}

export interface InfoActivity extends BaseActivity {
  type: 'info';
  infoText: string;
  facts: string[];
}

export interface QuizActivity extends BaseActivity {
  type: 'quiz';
  question: string;
  options: Array<{id: string, text: string}>;
  correctAnswer: string;
}

export interface DialogActivity extends BaseActivity {
  type: 'dialog';
  dialogOption: string;
  dialog: string[];
}

export interface MathActivity extends BaseActivity {
  type: 'math';
  question: string;
  options: Array<{id: string, text: string}>;
  correctAnswer: string;
}

export interface SafetyActivity extends BaseActivity {
  type: 'safety';
  questions: Array<{text: string, safe: boolean}>;
}

export interface PasswordActivity extends BaseActivity {
  type: 'password';
  requirements: Array<{text: string, color: string}>;
}

export interface WritingScanActivity extends BaseActivity {
  type: 'writing_scan';
  instructions: string;
  evaluationCriteria: Array<{id: string, text: string}>;
  sampleImage: any;
}

export type Activity = InfoActivity | QuizActivity | DialogActivity | MathActivity | SafetyActivity | PasswordActivity | WritingScanActivity;