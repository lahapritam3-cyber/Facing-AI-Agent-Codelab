import { FC, useState, useEffect } from 'react';
import {
  Database,
  X,
  Package,
  ShoppingBag,
  LifeBuoy,
  FileText,
  RefreshCw,
} from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'products' | 'tickets' | 'returns' | 'policies'>('orders');
  const [dbData, setDbData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDbState = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/agent/state');
      const data = await res.json();
      setDbData(data.database);
    } catch (err) {
      console.error('Failed to fetch DB state', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbState();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] max-w-4xl w-full max-h-[85vh] border border-white/20 flex flex-col overflow-hidden text-[#F5F5F5]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#050505] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Database &amp; Tool State Inspector
                </span>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-500/30">
                  Live Sync
                </span>
              </div>
              <p className="text-[10px] font-mono text-white/40 uppercase">
                Real-time mutations triggered by Gemini function calling tools
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchDbState}
              disabled={isLoading}
              className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Refresh DB State"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors font-mono"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#070707] px-6 py-2.5 gap-2 overflow-x-auto text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-3.5 py-1.5 transition-colors flex items-center space-x-2 border ${
              activeSubTab === 'orders'
                ? 'bg-white text-black font-bold border-white'
                : 'text-white/60 hover:text-white border-white/10 bg-white/5'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({dbData?.orders?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-3.5 py-1.5 transition-colors flex items-center space-x-2 border ${
              activeSubTab === 'products'
                ? 'bg-white text-black font-bold border-white'
                : 'text-white/60 hover:text-white border-white/10 bg-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products ({dbData?.products?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-3.5 py-1.5 transition-colors flex items-center space-x-2 border ${
              activeSubTab === 'tickets'
                ? 'bg-white text-black font-bold border-white'
                : 'text-white/60 hover:text-white border-white/10 bg-white/5'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Escalated Tickets ({dbData?.tickets?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('returns')}
            className={`px-3.5 py-1.5 transition-colors flex items-center space-x-2 border ${
              activeSubTab === 'returns'
                ? 'bg-white text-black font-bold border-white'
                : 'text-white/60 hover:text-white border-white/10 bg-white/5'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Processed Returns ({dbData?.processedReturns?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('policies')}
            className={`px-3.5 py-1.5 transition-colors flex items-center space-x-2 border ${
              activeSubTab === 'policies'
                ? 'bg-white text-black font-bold border-white'
                : 'text-white/60 hover:text-white border-white/10 bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Policies ({dbData?.policies?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* ORDERS */}
          {activeSubTab === 'orders' && (
            <div className="space-y-3">
              {dbData?.orders?.map((ord: any) => (
                <div
                  key={ord.orderId}
                  className="p-4 bg-[#050505] border border-white/10 text-xs space-y-2 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-sm">
                      {ord.orderId} // {ord.customerName}
                    </div>
                    <span
                      className={`px-2 py-0.5 font-bold text-[9px] uppercase border ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : 'bg-blue-950 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-white/60">
                    <div>Carrier: <strong className="text-white">{ord.carrier}</strong></div>
                    <div>Tracking: <strong className="text-white">{ord.trackingNumber}</strong></div>
                    <div>Total: <strong className="text-blue-400 font-bold">${ord.totalAmount}</strong></div>
                    <div>Return Eligible: <strong className={ord.returnEligible ? 'text-emerald-400' : 'text-rose-400'}>{ord.returnEligible ? 'YES' : 'NO'}</strong></div>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[11px] text-white/40">
                    Items: {ord.items.map((it: any) => `${it.name} (qty: ${it.quantity})`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRODUCTS */}
          {activeSubTab === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dbData?.products?.map((p: any) => (
                <div
                  key={p.sku}
                  className="p-4 bg-[#050505] border border-white/10 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-xs tracking-tight">{p.name}</span>
                    <span className="font-mono text-blue-400 font-bold text-sm">${p.price}</span>
                  </div>
                  <div className="text-[10px] font-mono text-white/50">SKU: {p.sku} • Category: {p.category}</div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/10 font-mono">
                    <span className={p.stockQuantity > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-bold'}>
                      {p.status} ({p.stockQuantity} units)
                    </span>
                    <span className="text-white/40">{p.warrantyMonths} mo warranty</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TICKETS (Live Human Escalations) */}
          {activeSubTab === 'tickets' && (
            <div className="space-y-3">
              {(!dbData?.tickets || dbData.tickets.length === 0) ? (
                <div className="text-center py-12 text-white/40 text-xs font-mono">
                  No human escalation tickets created yet. When the agent calls <code className="text-blue-400">escalateToHumanAgent()</code>, new tickets appear here in real time.
                </div>
              ) : (
                dbData.tickets.map((tck: any) => (
                  <div
                    key={tck.ticketId}
                    className="p-4 bg-[#050505] border border-amber-500/30 text-xs space-y-2 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">{tck.ticketId}</span>
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/40 font-bold text-[9px] uppercase">
                        {tck.urgency} PRIORITY
                      </span>
                    </div>
                    <div className="text-white font-semibold">Customer: {tck.customerEmail}</div>
                    <p className="text-[11px] text-white/70 font-sans">{tck.summary}</p>
                    <div className="text-[10px] text-white/40">{tck.createdAt}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PROCESSED RETURNS */}
          {activeSubTab === 'returns' && (
            <div className="space-y-3">
              {(!dbData?.processedReturns || dbData.processedReturns.length === 0) ? (
                <div className="text-center py-12 text-white/40 text-xs font-mono">
                  No returns processed yet. When a user requests a return on an eligible order and the agent calls <code className="text-blue-400">processReturn()</code>, the authorized return &amp; shipping label link will appear here.
                </div>
              ) : (
                dbData.processedReturns.map((ret: any) => (
                  <div
                    key={ret.returnId}
                    className="p-4 bg-[#050505] border border-emerald-500/30 text-xs space-y-1.5 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300">{ret.returnId}</span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] uppercase">
                        {ret.status}
                      </span>
                    </div>
                    <div className="text-white/80">Order: <strong className="text-white">{ret.orderId}</strong> | SKU: <strong className="text-white">{ret.sku}</strong></div>
                    <div className="text-[11px] text-white/60 font-sans">Reason: {ret.reason}</div>
                    <div className="text-[10px] text-blue-400 truncate">{ret.labelUrl}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* POLICIES */}
          {activeSubTab === 'policies' && (
            <div className="space-y-3">
              {dbData?.policies?.map((pol: any) => (
                <div
                  key={pol.topic}
                  className="p-4 bg-[#050505] border border-white/10 text-xs space-y-1.5"
                >
                  <div className="font-bold text-white uppercase tracking-tight">{pol.summary}</div>
                  <div className="text-[10px] font-mono text-blue-400 uppercase">Topic: {pol.topic}</div>
                  <p className="text-[11px] text-white/70 leading-relaxed font-light font-sans">{pol.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
