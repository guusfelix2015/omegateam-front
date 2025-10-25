import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLogin } from '../hooks/auth.hooks';
import { useAuth } from '../hooks/useAuth';
import { LoginRequestSchema, type LoginRequest } from '../types/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const loginMutation = useLogin();
  const loginSuccessRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  useEffect(() => {
    if (loginSuccessRef.current && isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      loginSuccessRef.current = false;
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const onSubmit = async (data: LoginRequest) => {
    if (isSubmitting || loginMutation.isPending) {
      return; // Evita múltiplas submissões
    }

    try {
      setIsSubmitting(true);
      loginSuccessRef.current = true;
      await loginMutation.mutateAsync(data);
      // Remove o window.location.href que causa refresh da página
      // A navegação já é tratada pelos useEffect acima
    } catch (error) {
      console.error('Login submission error:', error);
      loginSuccessRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">OmegaTeam</CardTitle>
          <CardDescription>
            Digite seu email e senha para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending || isSubmitting}
            >
              {loginMutation.isPending || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Acessar'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Não tem uma conta?{' '}
              </span>
              <Link to="/register" className="text-primary hover:underline">
                Registre-se aqui
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
