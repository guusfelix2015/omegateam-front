import { useState, useEffect } from 'react';
import { Gavel } from 'lucide-react';
import { useActiveAuction, usePlaceBid, useStartAuction, useFinalizeAuctionItem } from '../hooks/auction.hooks';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';

export default function AuctionActive() {
  const { isAdmin } = useAuth();
  const { data: auction, isLoading, error } = useActiveAuction(3000); // Poll every 3 seconds
  const placeBidMutation = usePlaceBid();
  const startAuctionMutation = useStartAuction();
  const finalizeItemMutation = useFinalizeAuctionItem();
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [localTimer, setLocalTimer] = useState<number | null>(null);

  // Get current item in auction
  const currentItem = auction?.items.find((item) => item.status === 'IN_AUCTION');

  // Update local timer
  useEffect(() => {
    if (currentItem?.timeRemaining !== null && currentItem?.timeRemaining !== undefined) {
      setLocalTimer(currentItem.timeRemaining);
    }
  }, [currentItem?.timeRemaining]);

  // Countdown timer
  useEffect(() => {
    if (localTimer === null || localTimer <= 0) return;

    const interval = setInterval(() => {
      setLocalTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [localTimer]);

  // Set initial bid amount when current item changes
  useEffect(() => {
    if (currentItem) {
      const minBid = currentItem.currentBid
        ? currentItem.currentBid + (auction?.minBidIncrement || 1)
        : currentItem.minBid;
      setBidAmount(minBid);
    }
  }, [currentItem, auction?.minBidIncrement]);

  const handlePlaceBid = async () => {
    if (!currentItem) return;

    const minBid = currentItem.currentBid
      ? currentItem.currentBid + (auction?.minBidIncrement || 1)
      : currentItem.minBid;

    if (bidAmount < minBid) {
      alert(`Minimum bid is ${minBid} DKP`);
      return;
    }

    try {
      await placeBidMutation.mutateAsync({
        auctionItemId: currentItem.id,
        amount: bidAmount,
      });
    } catch (error) {
      console.error('Failed to place bid:', error);
      alert('Failed to place bid. Please try again.');
    }
  };

  const handleStartAuction = async () => {
    if (!auction) return;

    try {
      await startAuctionMutation.mutateAsync(auction.id);
    } catch (error) {
      console.error('Failed to start auction:', error);
      alert('Failed to start auction. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading auction...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading auction</div>
        </div>
      </Layout>
    );
  }

  if (!auction) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Leilão Ativo</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe o leilão em tempo real
            </p>
          </div>

          <Card className="p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-muted p-6">
                  <Gavel className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Nenhum Leilão Ativo</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Não há leilão em andamento no momento. Aguarde o próximo leilão.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const isPending = auction.status === 'PENDING';
  const isActive = auction.status === 'ACTIVE';

  const handleFinalizeItem = async () => {
    if (!currentItem) return;

    if (window.confirm('Tem certeza que deseja finalizar este item?')) {
      try {
        await finalizeItemMutation.mutateAsync(currentItem.id);
      } catch (error) {
        console.error('Failed to finalize item:', error);
        alert('Erro ao finalizar item. Tente novamente.');
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Auction Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                {isPending ? 'Auction (Pending)' : 'Live Auction'}
              </h1>
              <p className="text-gray-600">
                Created by {auction.creator.nickname} •{' '}
                {new Date(auction.createdAt).toLocaleDateString()}
              </p>
            </div>
            {isPending && isAdmin && (
              <button
                onClick={handleStartAuction}
                disabled={startAuctionMutation.isPending}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {startAuctionMutation.isPending ? 'Starting...' : 'Start Auction'}
              </button>
            )}
          </div>

          {auction.notes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">{auction.notes}</p>
            </div>
          )}
        </div>

        {/* Current Item */}
        {isActive && currentItem && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Current Item</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{currentItem.raidDroppedItem.name}</h3>
                  <p className="text-gray-600">
                    {currentItem.raidDroppedItem.category} • Grade{' '}
                    {currentItem.raidDroppedItem.grade}
                  </p>
                  <p className="text-sm text-gray-500">
                    From: {currentItem.raidDroppedItem.raidInstance.raid.name}
                  </p>
                </div>

                {/* Timer */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {localTimer !== null ? localTimer : currentItem.timeRemaining || 0}s
                  </div>
                  <div className="text-sm text-gray-600">Time Remaining</div>
                </div>
              </div>

              {/* Current Bid */}
              <div className="p-4 bg-gray-50 rounded-md">
                {currentItem.currentBid && currentItem.currentWinner ? (
                  <div>
                    <div className="text-sm text-gray-600">Current Highest Bid</div>
                    <div className="text-2xl font-bold text-green-600">
                      {currentItem.currentBid} DKP
                    </div>
                    <div className="text-sm text-gray-600">
                      by {currentItem.currentWinner.nickname}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-600">Minimum Bid</div>
                    <div className="text-2xl font-bold">{currentItem.minBid} DKP</div>
                    <div className="text-sm text-gray-600">No bids yet</div>
                  </div>
                )}
              </div>

              {/* Bid Form */}
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={
                    currentItem.currentBid
                      ? currentItem.currentBid + (auction.minBidIncrement || 1)
                      : currentItem.minBid
                  }
                  className="flex-1 px-4 py-2 border rounded-md"
                  placeholder="Enter bid amount"
                />
                <button
                  onClick={handlePlaceBid}
                  disabled={placeBidMutation.isPending}
                  className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {placeBidMutation.isPending ? 'Placing...' : 'Place Bid'}
                </button>
                {isAdmin && (
                  <button
                    onClick={handleFinalizeItem}
                    disabled={finalizeItemMutation.isPending}
                    className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {finalizeItemMutation.isPending ? 'Finalizando...' : 'Finalizar'}
                  </button>
                )}
              </div>

              {/* Recent Bids */}
              {currentItem.bids.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Recent Bids</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {currentItem.bids.slice(0, 10).map((bid) => (
                      <div
                        key={bid.id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium">{bid.user.nickname}</span>
                        <span className="text-blue-600 font-semibold">{bid.amount} DKP</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items Queue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Items in Auction</h2>

          <div className="space-y-2">
            {auction.items.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-md border ${item.status === 'IN_AUCTION'
                  ? 'bg-blue-50 border-blue-500'
                  : item.status === 'SOLD'
                    ? 'bg-green-50 border-green-500'
                    : item.status === 'NO_BIDS'
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-white border-gray-200'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      #{index + 1} - {item.raidDroppedItem.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.raidDroppedItem.category} • Grade {item.raidDroppedItem.grade}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {item.status === 'SOLD' && item.currentBid
                        ? `Sold: ${item.currentBid} DKP`
                        : item.status === 'NO_BIDS'
                          ? 'No Bids'
                          : item.status === 'IN_AUCTION'
                            ? 'In Auction'
                            : 'Waiting'}
                    </div>
                    {item.currentWinner && (
                      <div className="text-xs text-gray-600">
                        Winner: {item.currentWinner.nickname}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

