import { Link } from 'react-router-dom';
import {
  Settings,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Layout } from '../components/Layout';

export default function Admin() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Controle Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie todos os aspectos do sistema OmegaTeam
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Regras
              </CardTitle>
              <CardDescription>Regras do cla</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure regras gerais do do cla.
              </p>
              <Button className="w-full" asChild>
                <Link to="/admin/rules">Regras</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                Usuários Inativos
              </CardTitle>
              <CardDescription>Gerenciar inatividade</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Monitore e gerencie usuários que não fazem login há mais de 7 dias.
              </p>
              <Button className="w-full" asChild>
                <Link to="/admin/inactive-users">Gerenciar Inativos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
