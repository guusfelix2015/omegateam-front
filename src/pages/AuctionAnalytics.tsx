import { useAuctionAnalytics } from '../hooks/auction.hooks';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Trophy,
  BarChart3,
  PieChart,
  Calendar,
  Loader2,
} from 'lucide-react';

export default function AuctionAnalytics() {
  const { data: analytics, isLoading, error } = useAuctionAnalytics();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando analytics...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-destructive">Erro ao carregar analytics</div>
        </div>
      </Layout>
    );
  }

  if (!analytics) {
    return <Layout><div>Sem dados</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Relatórios & Análises de Leilões</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Leilões</p>
                <p className="text-3xl font-bold">{analytics.totalAuctions}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Itens Vendidos</p>
                <p className="text-3xl font-bold text-green-600">{analytics.totalItemsSold}</p>
              </div>
              <Trophy className="h-10 w-10 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sem Lances</p>
                <p className="text-3xl font-bold text-yellow-600">{analytics.totalItemsNoBids}</p>
              </div>
              <Package className="h-10 w-10 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">DKP Total Gasto</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics.totalDkpSpent.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Média de DKP por Item</h3>
            </div>
            <p className="text-2xl font-bold">{analytics.averageDkpPerItem.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">Média de Lances por Item</h3>
            </div>
            <p className="text-2xl font-bold">{analytics.averageBidsPerItem}</p>
          </Card>
        </div>

        {/* Most Popular Items */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold">Itens Mais Populares</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Lances</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leilões</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Médio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maior Preço</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.mostPopularItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{item.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.totalBids}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.totalAuctions}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.averagePrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                      {item.highestPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Spenders */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-bold">Maiores Gastadores</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jogador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nickname</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Gasto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens Ganhos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Média por Item</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.topSpenders.map((spender, index) => (
                  <tr key={spender.userId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {index < 3 && (
                          <span className="text-2xl">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                        <span className="font-medium">{spender.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{spender.userNickname}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-purple-600">
                      {spender.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{spender.itemsWon}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{spender.averageSpent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold">Distribuição por Categoria</h2>
            </div>
            <div className="space-y-3">
              {analytics.categoryDistribution.map((cat) => (
                <div key={cat.category} className="border-b pb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-sm text-gray-600">{cat.count} itens</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total DKP:</span>
                    <span className="font-semibold">{cat.totalDkp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Média DKP:</span>
                    <span className="font-semibold">{cat.averageDkp.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Grade Distribution */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-bold">Distribuição por Grade</h2>
            </div>
            <div className="space-y-3">
              {analytics.gradeDistribution.map((grade) => (
                <div key={grade.grade} className="border-b pb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Grade {grade.grade}</span>
                    <span className="text-sm text-gray-600">{grade.count} itens</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total DKP:</span>
                    <span className="font-semibold">{grade.totalDkp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Média DKP:</span>
                    <span className="font-semibold">{grade.averageDkp.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Auction Trends */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-bold">Tendências (Últimos 30 Dias)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leilões</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens Vendidos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DKP Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.auctionTrends.map((trend) => (
                  <tr key={trend.date}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {new Date(trend.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{trend.auctionsCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trend.itemsSold}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {trend.totalDkp.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

