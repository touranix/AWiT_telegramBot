import { useState } from 'react';
import { Plus, X, User } from './ui/simple-icons';
import { Button } from './ui/simple-button';
import { Input } from './ui/simple-input';
import { Textarea } from './ui/simple-textarea';
import { Card } from './ui/simple-card';

interface NewQuestion {
  title: string;
  description: string;
  tags: string;
  category: string;
}

interface AddQuestionFormProps {
  onAddQuestion: (question: NewQuestion) => void;
  currentUser: string | null;
  categories?: any;
  onCancel?: () => void;
}

interface ValidationErrors {
  title?: string;
  description?: string;
}

export function AddQuestionForm({ onAddQuestion, currentUser, categories, onCancel }: AddQuestionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState<NewQuestion>({
    title: '',
    description: '',
    tags: '',
    category: 'programming'
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!question.title.trim()) {
      newErrors.title = 'Заголовок вопроса обязателен';
    } else if (question.title.trim().length < 10) {
      newErrors.title = 'Заголовок должен содержать минимум 10 символов';
    }

    if (!question.description.trim()) {
      newErrors.description = 'Описание вопроса обязательно';
    } else if (question.description.trim().length < 20) {
      newErrors.description = 'Описание должно содержать минимум 20 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!currentUser) {
      alert('Войдите в систему, чтобы задать вопрос');
      return;
    }

    if (validateForm()) {
      onAddQuestion({
        title: question.title.trim(),
        description: question.description.trim(),
        tags: question.tags.trim(),
        category: question.category
      });
      setQuestion({ title: '', description: '', tags: '', category: 'programming' });
      setErrors({});
      setIsOpen(false);
      if (onCancel) onCancel();
    }
  };

  const handleCancel = () => {
    setQuestion({ title: '', description: '', tags: '', category: 'programming' });
    setErrors({});
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  const handleOpenForm = () => {
    if (!currentUser) {
      alert('Войдите в систему, чтобы задать вопрос');
      return;
    }
    setIsOpen(true);
  };

  const handleInputChange = (field: keyof NewQuestion, value: string) => {
    setQuestion({ ...question, [field]: value });
    // Очищаем ошибку при изменении поля
    if (errors[field as keyof ValidationErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // If used in the main app with categories prop, render the inline form
  if (categories) {
    return (
      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Тема вопроса <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(categories).map(([key, category]: [string, any]) => {
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setQuestion(prev => ({ ...prev, category: key }))}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    question.category === key 
                      ? `${category.border} ${category.bg} border-opacity-100` 
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                  }`}
                >
                  <Icon size={20} className={question.category === key ? category.text : 'text-gray-400'} />
                  <span className={`text-sm font-medium ${question.category === key ? category.text : 'text-gray-300'}`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Заголовок <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Кратко сформулируйте свой вопрос..."
            value={question.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && (
            <p className="text-sm text-red-400 mt-1">{errors.title}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Минимум 10 символов</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Описание вопроса <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Подробно опишите ваш вопрос..."
            value={question.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white resize-none ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-400 mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Минимум 20 символов</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Теги</label>
          <Input
            placeholder="javascript, react, помощь..."
            value={question.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            className="bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Необязательно. Помогают другим пользователям найти ваш вопрос
          </p>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSubmit} 
            className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
          >
            Опубликовать вопрос
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  // Original toggle form for backward compatibility
  if (!isOpen) {
    return (
      <div className="mb-8 opacity-0 translate-y-5 animate-[fadeInUp_0.3s_ease-out_forwards]">
        <Button
          onClick={handleOpenForm}
          className={`w-full h-16 border-dashed border-2 flex items-center gap-3 ${
            currentUser 
              ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500' 
              : 'bg-gray-800/20 hover:bg-gray-700/30 text-gray-400 border-gray-600/30'
          }`}
          variant="outline"
        >
          <Plus size={24} />
          <span>
            {currentUser 
              ? 'Задать новый вопрос' 
              : 'Войдите в систему, чтобы задать вопрос'
            }
          </span>
          {!currentUser && <User size={20} />}
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8 opacity-0 -translate-y-5 animate-[fadeInDown_0.3s_ease-out_forwards]">
      <Card className="p-6 bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-purple-400">Новый вопрос</h3>
              <p className="text-sm text-gray-400">От: {currentUser}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2">
                Заголовок вопроса <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Кратко опишите ваш вопрос..."
                value={question.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && (
                <p className="text-sm text-red-400 mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Минимум 10 символов</p>
            </div>
            
            <div>
              <label className="block mb-2">
                Подробное описание <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Опишите ваш вопрос подробнее..."
                value={question.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`min-h-[120px] bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Минимум 20 символов</p>
            </div>
            
            <div>
              <label className="block mb-2">Теги (через запятую)</label>
              <Input
                placeholder="javascript, react, помощь..."
                value={question.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Необязательно. Помогают другим пользователям найти ваш вопрос
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white">
              Опубликовать вопрос
            </Button>
            <Button variant="outline" onClick={handleCancel} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Отмена
            </Button>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t border-gray-700/50">
            <span className="text-red-500">*</span> Обязательные поля для заполнения
          </div>
        </div>
      </Card>
    </div>
  );
}