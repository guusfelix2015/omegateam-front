import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateAuction } from '../hooks/auction.hooks';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';


interface RaidDroppedItemResponse {
  id: string;
  name: string;
  category: string;
  grade: string;
  minDkpBid: number;
  hasBeenAuctioned: boolean;
  raidInstance: {
    id: string;
    completedAt: string;
    raid: {
      id: string;
      name: string;
    };
  };
}

export default function AuctionCreate() {
  const navigate = useNavigate();
  const createAuctionMutation = useCreateAuction();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [defaultTimerSeconds, setDefaultTimerSeconds] = useState<number>(20);
  const [minBidIncrement, setMinBidIncrement] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Fetch available raid dropped items (not yet auctioned)
  const { data: availableItems, isLoading } = useQuery<RaidDroppedItemResponse[]>({
    queryKey: ['raid-dropped-items', 'available'],
    queryFn: async () => {
      const response = await api.get('/raid-dropped-items');
      // Filter items that haven't been auctioned
      return response.data.filter((item: RaidDroppedItemResponse) => !item.hasBeenAuctioned);
    },
  });

  const handleToggleItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItemIds.length === 0) {
      alert('Please select at least one item');
      return;
    }

    try {
      await createAuctionMutation.mutateAsync({
        itemIds: selectedItemIds,
        defaultTimerSeconds,
        minBidIncrement,
        notes: notes || undefined,
      });

      alert('Auction created successfully!');
      navigate('/auctions');
    } catch (error) {
      console.error('Failed to create auction:', error);
      alert('Failed to create auction. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading available items...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Auction</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auction Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Auction Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Default Timer (seconds)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={defaultTimerSeconds}
                  onChange={(e) => setDefaultTimerSeconds(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Bid Increment (DKP)
                </label>
                <input
                  type="number"
                  min="1"
                  value={minBidIncrement}
                  onChange={(e) => setMinBidIncrement(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Add any notes about this auction..."
              />
            </div>
          </div>

          {/* Item Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Select Items ({selectedItemIds.length} selected)
            </h2>

            {!availableItems || availableItems.length === 0 ? (
              <p className="text-gray-500">No items available for auction.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedItemIds.includes(item.id) ? 'bg-blue-50 border-blue-500' : ''
                      }`}
                    onClick={() => handleToggleItem(item.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                        className="h-5 w-5"
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.category} • Grade {item.grade} • Min Bid: {item.minDkpBid} DKP
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.raidInstance.raid.name} •{' '}
                          {new Date(item.raidInstance.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/auctions')}
              className="px-6 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedItemIds.length === 0 || createAuctionMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {createAuctionMutation.isPending ? 'Creating...' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

