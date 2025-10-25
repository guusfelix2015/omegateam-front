import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
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
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useRegister } from '../hooks/auth.hooks';
import { useClasses } from '../hooks/classes.hooks';
import { RegisterRequestSchema, type RegisterRequest } from '../types/api';

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const { data: classes = [] } = useClasses();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      nickname: '',
      phone: '+55',
      lvl: 1,
      playerType: 'PVP',
      classeId: '',
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    if (isSubmitting || registerMutation.isPending) {
      return;
    }

    try {
      setIsSubmitting(true);
      await registerMutation.mutateAsync(data);
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Registro realizado com sucesso! Faça login para continuar.' },
        });
      }, 1500);
    } catch (error) {
      console.error('Registration submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para se registrar no OmegaTeam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Informações Pessoais</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname *</Label>
                  <Input
                    id="nickname"
                    placeholder="Seu nickname no jogo"
                    {...register('nickname')}
                  />
                  {errors.nickname && (
                    <p className="text-sm text-destructive">
                      {errors.nickname.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+55XXXXXXXXXXX"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Game Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Informações do Jogo</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="playerType">Tipo de Jogador *</Label>
                  <Select
                    value={watch('playerType')}
                    onValueChange={(value) =>
                      setValue('playerType', value as 'PVP' | 'PVE')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PVP">PVP</SelectItem>
                      <SelectItem value="PVE">PVE</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.playerType && (
                    <p className="text-sm text-destructive">
                      {errors.playerType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classeId">Classe *</Label>
                  <Select
                    value={watch('classeId') || ''}
                    onValueChange={(value) => setValue('classeId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classe) => (
                        <SelectItem key={classe.id} value={classe.id}>
                          {classe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.classeId && (
                    <p className="text-sm text-destructive">
                      {errors.classeId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lvl">Nível do Personagem *</Label>
                <Input
                  id="lvl"
                  type="number"
                  min="1"
                  max="85"
                  placeholder="Digite o nível (1-85)"
                  {...register('lvl', { valueAsNumber: true })}
                />
                {errors.lvl && (
                  <p className="text-sm text-destructive">
                    {errors.lvl.message}
                  </p>
                )}
              </div>
            </div>

            {/* Security Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Segurança</h3>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending || isSubmitting}
            >
              {registerMutation.isPending || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Já tem uma conta?{' '}
              </span>
              <Link to="/login" className="text-primary hover:underline">
                Faça login aqui
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

