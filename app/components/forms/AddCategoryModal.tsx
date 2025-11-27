"use client";

export default function AddCategoryModal({ isOpen, onClose, categories }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // Clicking on the overlay closes modal
    >
      {/* Modal container */}
      <div
        className="bg-white p-10 rounded-2xl shadow-xl w-[60%] max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold">Select a Category</h2>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Category bubbles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 text-black rounded-lg cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="font-bold text-lg">{category.type}</div>
              <div className="text-sm mt-1">{category.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
