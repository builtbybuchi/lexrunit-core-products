import React, { useState, useEffect } from 'react';

// A simple ID generator
const generateId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;


// Fix: Export the Field interface to allow for strong typing in other files.
export interface Field {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'date';
}

interface ContentManagerProps<T extends { id: string }> {
    title: string;
    items: T[];
    onSave: (items: T[]) => void;
    fields: Field[];
}

const ContentManager = <T extends { id: string; [key: string]: any }>({ title, items, onSave, fields }: ContentManagerProps<T>) => {
    const [currentItems, setCurrentItems] = useState<T[]>(items);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<T | null>(null);

    useEffect(() => {
        setCurrentItems(items);
    }, [items]);
    
    const handleSave = () => {
        if (!currentItem) return;

        let updatedItems;
        const existingItem = currentItems.find(item => item.id === currentItem.id);

        if (existingItem) {
            // Update
            updatedItems = currentItems.map(item => item.id === currentItem.id ? currentItem : item);
        } else {
            // Add new
            updatedItems = [...currentItems, { ...currentItem, id: generateId() }];
        }

        onSave(updatedItems);
        setCurrentItems(updatedItems);
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const updatedItems = currentItems.filter(item => item.id !== id);
            onSave(updatedItems);
            setCurrentItems(updatedItems);
        }
    };
    
    const openModal = (item: T | null = null) => {
        if (item) {
            setCurrentItem(item);
        } else {
            // Create a blank item based on fields
            const blankItem = fields.reduce((acc, field) => {
                acc[field.name] = '';
                return acc;
            }, {} as any);
            setCurrentItem(blankItem);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!currentItem) return;
        const { name, value } = e.target;
        setCurrentItem({ ...currentItem, [name]: value });
    };
    
    const displayValue = (value: any) => {
        if (typeof value === 'string' && value.length > 50) {
            return value.substring(0, 50) + '...';
        }
        return value;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-lex-dark-blue">Manage {title}</h2>
                <button onClick={() => openModal()} className="bg-lex-med-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-lex-bright-blue transition-colors duration-300">
                    Add New
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            {fields.slice(0, 3).map(field => <th key={field.name} className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 uppercase text-sm text-gray-600">{field.label}</th>)}
                            <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 uppercase text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                {fields.slice(0, 3).map(field => <td key={field.name} className="py-2 px-4 border-b border-gray-200">{displayValue(item[field.name])}</td>)}
                                <td className="py-2 px-4 border-b border-gray-200 space-x-2">
                                    <button onClick={() => openModal(item)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && currentItem && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6">{currentItem.id ? 'Edit' : 'Add'} {title.slice(0, -1)}</h3>
                        <div className="space-y-4">
                            {fields.map(field => (
                                <div key={field.name}>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.name}
                                            value={currentItem[field.name] || ''}
                                            onChange={handleInputChange}
                                            rows={field.name === 'content' ? 10 : 4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lex-med-blue"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={currentItem[field.name] || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lex-med-blue"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-4 mt-8">
                            <button onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-lex-bright-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-lex-med-blue">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;