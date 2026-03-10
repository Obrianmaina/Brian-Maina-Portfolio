'use client';

import React from 'react';
import { Plus, Trash2, Edit, ChevronDown } from 'lucide-react';
import { CatalogService, CatalogBundle, CatalogPrices } from '@/types';
import DownloadCatalogButton from '@/components/DownloadCatalogButton';

interface GroupedCategory {
  category: string;
  items: CatalogService[];
}

interface CatalogViewProps {
  activeCatalogTab: 'kenyan' | 'international' | 'bundles';
  setActiveCatalogTab: (tab: 'kenyan' | 'international' | 'bundles') => void;
  intlCurrency: 'USD' | 'EUR' | 'GBP';
  setIntlCurrency: (c: 'USD' | 'EUR' | 'GBP') => void;
  expandedCategories: string[];
  groupedCategories: GroupedCategory[];
  catalogBundles: CatalogBundle[];
  getCurrencySymbol: () => string;
  getDisplayPrice: (prices: CatalogPrices) => string;
  toggleCategory: (category: string) => void;
  openNewServiceModal: () => void;
  openEditServiceModal: (service: CatalogService) => void;
  openNewBundleModal: () => void;
  openEditBundleModal: (bundle: CatalogBundle) => void;
  deleteCatalogItem: (id: string, type: 'service' | 'bundle') => void;
}

export default function CatalogView({
  activeCatalogTab, setActiveCatalogTab,
  intlCurrency, setIntlCurrency,
  expandedCategories,
  groupedCategories,
  catalogBundles,
  getCurrencySymbol, getDisplayPrice,
  toggleCategory,
  openNewServiceModal, openEditServiceModal,
  openNewBundleModal, openEditBundleModal,
  deleteCatalogItem,
}: CatalogViewProps) {
  return (
    <div className="fade-in bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Manage Base Price List</h2>
        <div className="flex items-center gap-4">
          <DownloadCatalogButton currency={activeCatalogTab === 'kenyan' ? 'KES' : intlCurrency} />
          <button
            onClick={activeCatalogTab === 'bundles' ? openNewBundleModal : openNewServiceModal}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={18} />
            <span>Add New {activeCatalogTab === 'bundles' ? 'Bundle' : 'Service'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6 pb-2">
        {(['kenyan', 'international', 'bundles'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveCatalogTab(tab)}
            className={`pb-2 px-3 font-medium capitalize ${activeCatalogTab === tab ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {tab === 'kenyan' ? 'Kenyan (KES)' : tab === 'international' ? 'International' : 'Bundled Services'}
          </button>
        ))}
      </div>

      {/* International Currency Picker */}
      {activeCatalogTab === 'international' && (
        <div className="flex gap-2 mb-6">
          {(['USD', 'EUR', 'GBP'] as const).map(curr => (
            <button
              key={curr}
              onClick={() => setIntlCurrency(curr)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${intlCurrency === curr ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {curr}
            </button>
          ))}
        </div>
      )}

      {/* Services List */}
      {(activeCatalogTab === 'kenyan' || activeCatalogTab === 'international') && (
        <div className="space-y-4">
          {groupedCategories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No services found. Click &quot;Add New Service&quot; to start.</p>
          ) : (
            groupedCategories.map(group => (
              <div key={group.category} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{group.category}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transform transition-transform ${expandedCategories.includes(group.category) ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedCategories.includes(group.category) && (
                  <div>
                    {group.items.map(item => (
                      <div key={item._id} className="flex justify-between items-center p-4 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <div className="flex items-center gap-6">
                          <span className="font-mono font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
                            {getCurrencySymbol()} {getDisplayPrice(item.prices)}
                          </span>
                          <div className="flex gap-2">
                            <button onClick={() => openEditServiceModal(item)} className="text-gray-400 hover:text-teal-600 p-1 transition-colors" title="Edit Price">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => deleteCatalogItem(item._id!, 'service')} className="text-gray-400 hover:text-red-500 p-1 transition-colors" title="Delete Item">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Bundles Grid */}
      {activeCatalogTab === 'bundles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogBundles.length === 0 ? (
            <p className="text-gray-500 py-8 col-span-full text-center">No bundles found. Click &quot;Add New Bundle&quot; to start.</p>
          ) : (
            catalogBundles.map(bundle => (
              <div key={bundle._id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{bundle.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => openEditBundleModal(bundle)} className="text-gray-400 hover:text-teal-600 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => deleteCatalogItem(bundle._id!, 'bundle')} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{bundle.description}</p>

                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Includes:</h4>
                  <ul className="space-y-2">
                    {bundle.includedServices.map((service, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Starting at</span>
                    <span className="text-2xl font-bold text-teal-600">KES {bundle.prices.KES.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
