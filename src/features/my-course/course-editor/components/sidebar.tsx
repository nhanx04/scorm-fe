import React from 'react';
import {
  FiFile,
  FiLayout,
  FiLayers,
  FiCheckSquare,
  FiEdit,
  FiBox,
  FiAlignLeft,
  FiList,
  FiCheckCircle,
} from 'react-icons/fi';
import { ComponentCard } from './component-card';
import { QuestionCard } from './question-card';

export type SidebarProps = {
  selectedComponent?: string;
  onSelectComponent: (id: string) => void;
  selectedQuestion?: string;
  onSelectQuestion: (id: string) => void;
};

export function Sidebar({
  selectedComponent,
  onSelectComponent,
  selectedQuestion,
  onSelectQuestion,
}: SidebarProps) {
  const components = [
    { id: 'page', title: 'Page', icon: <FiFile /> },
    { id: 'section', title: 'Section', icon: <FiLayout /> },
    { id: 'content-page', title: 'Content Page', icon: <FiEdit /> },
    { id: 'quiz-page', title: 'Quiz Page', icon: <FiCheckSquare /> },
    { id: 'content-block', title: 'Content Block', icon: <FiBox /> },
  ];

  const questions = [
    {
      id: 'mcq-single',
      title: 'MCQ – Single choice',
      description: 'Câu hỏi trắc nghiệm một đáp án',
      icon: <FiAlignLeft />,
    },
    {
      id: 'mcq-multi',
      title: 'MCQ – Multiple choice',
      description: 'Câu hỏi trắc nghiệm một đáp án',
      icon: <FiList />,
    },
    {
      id: 'true-false',
      title: 'True/False',
      description: 'Câu hỏi đúng sai',
      icon: <FiCheckCircle />,
    },
  ];

  return (
    <div className="w-[280px] h-full bg-gray-50 border-r overflow-y-auto p-6 flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-bold text-gray-800 mb-4">Component</h3>
        <div className="grid grid-cols-2 gap-3">
          {components.map((comp) => (
            <ComponentCard
              key={comp.id}
              title={comp.title}
              icon={comp.icon}
              selected={selectedComponent === comp.id}
              onClick={() => onSelectComponent(comp.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-gray-800 mb-4">Question Type</h3>
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              title={q.title}
              description={q.description}
              icon={q.icon}
              selected={selectedQuestion === q.id}
              onClick={() => onSelectQuestion(q.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

