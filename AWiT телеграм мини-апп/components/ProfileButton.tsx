import { useState } from 'react';
import { User, Settings, LogOut } from './ui/simple-icons';
import { Button } from './ui/simple-button';
import { Card } from './ui/simple-card';

interface ProfileButtonProps {
  currentUser: string | null;
  onLogin: (nickname: string) => void;
  onLogout: () => void;
}

export function ProfileButton({ currentUser, onLogin, onLogout }: ProfileButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const validateNickname = (value: string): boolean => {
    if (!value.trim()) {
      setNicknameError('Никнейм не может быть пустым');
      return false;
    }
    
    if (value.trim().length < 3) {
      setNicknameError('Никнейм должен содержать минимум 3 символа');
      return false;
    }
    
    if (value.trim().length > 20) {
      setNicknameError('Никнейм не может быть длиннее 20 символов');
      return false;
    }

    const allowedPattern = /^[a-zA-Zа-яА-ЯёЁ0-9_\-]+$/;
    if (!allowedPattern.test(value.trim())) {
      setNicknameError('Никнейм может содержать только буквы, цифры, дефис и подчеркивание');
      return false;
    }

    setNicknameError('');
    return true;
  };

  const handleLogin = () => {
    if (validateNickname(nickname)) {
      onLogin(nickname.trim());
      setNickname('');
      setShowLoginForm(false);
      setShowDropdown(false);
      setNicknameError('');
    }
  };

  const handleLogout = () => {
    onLogout();
    setShowDropdown(false);
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (nicknameError) {
      setNicknameError('');
    }
  };

  const handleCancelLogin = () => {
    setShowLoginForm(false);
    setNickname('');
    setNicknameError('');
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 bg-card border-border/50"
      >
        <User size={16} />
        {currentUser || 'Гость'}
      </Button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 z-50 opacity-0 translate-y-2 animate-[fadeInUp_0.2s_ease-out_forwards]">
          <Card className="p-4 w-64 bg-card border-border/50 shadow-lg">
            {currentUser ? (
              <div className="space-y-3">
                <div className="text-center pb-2 border-b border-border/50">
                  <p className="text-sm text-muted-foreground">Вы вошли как</p>
                  <p className="font-medium">{currentUser}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Выйти
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {!showLoginForm ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">
                      Войдите, чтобы задавать вопросы и отвечать
                    </p>
                    <Button
                      onClick={() => setShowLoginForm(true)}
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Войти
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">
                        Ваш никнейм <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Введите никнейм..."
                        value={nickname}
                        onChange={(e) => handleNicknameChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        className={`w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none transition-colors ${
                          nicknameError 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-border/50 focus:border-purple-500'
                        }`}
                        autoFocus
                      />
                      {nicknameError && (
                        <p className="text-xs text-red-500 mt-1">{nicknameError}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        3-20 символов, только буквы, цифры, дефис и подчеркивание
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleLogin}
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Войти
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelLogin}
                        className="flex-1"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}