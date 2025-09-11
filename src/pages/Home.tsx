import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

import { useAuth } from '../hooks/useAuth';
import { useCompanyParties } from '../hooks/company-parties.hooks';
import { Layout } from '../components/Layout';

export default function Home() {
  const { user, isAdmin } = useAuth();
  const { data: companyParties } = useCompanyParties();


  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}! ({isAdmin ? 'Administrador' : 'Jogador'})
          </p>
        </div>

        {isAdmin && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Painel Administrativo</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de CPs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyParties?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Company Parties ativas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Membros Totais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {companyParties?.reduce((acc, cp) => acc + cp.currentMembers, 0) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Jogadores ativos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">CPs Ativas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {companyParties?.filter(cp => cp.isActive).length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Em funcionamento</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Ocupação Média</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {companyParties && companyParties.length > 0
                        ? Math.round((companyParties.reduce((acc, cp) => acc + (cp.currentMembers / cp.maxMembers), 0) / companyParties.length) * 100)
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">Capacidade utilizada</p>
                  </CardContent>
                </Card>
              </div>
            </div>


          </>
        )}
      </div>
    </Layout>
  );
}
