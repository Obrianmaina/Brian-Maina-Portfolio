import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  isFormOpen: boolean;
  isReordering: boolean;
  onAddCompany: () => void;
  onCancelForm: () => void;
  onStartReorder: () => void;
  onCancelReorder: () => void;
  onSaveOrder: () => void;
  fetchCompanies: () => void;
};

export default function CorporateHeader({
  isFormOpen,
  isReordering,
  onAddCompany,
  onCancelForm,
  onStartReorder,
  onCancelReorder,
  onSaveOrder,
  fetchCompanies,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-8">
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Hub
      </button>

      <div className="flex gap-2">
        {!isFormOpen && !isReordering && (
          <button
            onClick={onStartReorder}
            className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
          >
            Reorder
          </button>
        )}

        {isReordering && (
          <>
            <button
              onClick={() => { onCancelReorder(); fetchCompanies(); }}
              className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSaveOrder}
              className="flex items-center bg-violet-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-violet-700 transition-colors"
            >
              <Save size={18} className="mr-2" /> Save Order
            </button>
          </>
        )}

        {!isReordering && (
          <>
            {isFormOpen ? (
              <button
                onClick={onCancelForm}
                className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                <X size={16} className="mr-1" /> Cancel
              </button>
            ) : (
              <button
                onClick={onAddCompany}
                className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} className="mr-2" /> Add Company
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}