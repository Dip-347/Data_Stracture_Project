import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Book, Filter, BookmarkPlus, ShoppingCart, X, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History'];

export const BookBrowsing = () => {
    const { books, isDataLoaded, stats, submitRequest } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [page, setPage] = useState(1);
    
    // Cart State
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const itemsPerPage = 10;
    
    const [bookList, setBookList] = useState(() => books.getAll());

    useEffect(() => {
        setBookList(books.getAll());
    }, [isDataLoaded, books, stats.booksCount]);

    const dynamicCategories = useMemo(() => {
        const cats = new Set(bookList.map(b => b.category).filter(Boolean));
        return ['All', ...Array.from(cats)].sort();
    }, [bookList]);

    const filteredBooks = useMemo(() => {
        return bookList.filter(book => {
            const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  book.author?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [bookList, searchTerm, selectedCategory]);

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const paginatedBooks = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredBooks.slice(start, start + itemsPerPage);
    }, [filteredBooks, page]);

    const handleAddToCart = (book) => {
        const existing = cart.find(item => item.bookId === book.$id);
        const maxCopies = book.copies || 1;
        if (existing) {
            if (existing.qty < maxCopies) {
                setCart(cart.map(item => item.bookId === book.$id ? { ...item, qty: item.qty + 1 } : item));
            }
        } else {
            setCart([...cart, { bookId: book.$id, title: book.title, qty: 1, maxCopies }]);
        }
    };

    const handleUpdateCartQty = (bookId, delta) => {
        setCart(cart.map(item => {
            if (item.bookId === bookId) {
                const newQty = Math.max(1, Math.min(item.maxCopies, item.qty + delta));
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const handleRemoveFromCart = (bookId) => {
        setCart(cart.filter(item => item.bookId !== bookId));
    };

    const handleSubmitCart = () => {
        if (cart.length === 0) return;
        
        const mockUserStr = localStorage.getItem('mockUser');
        const mockUser = mockUserStr ? JSON.parse(mockUserStr) : null;
        const studentEmail = user?.email || mockUser?.email || 'student@example.com';
        
        submitRequest(studentEmail, cart);
        setCart([]);
        setIsCartOpen(false);
        alert("Your request has been submitted successfully!");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Library Catalog</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse and request books from the library.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search catalog by title or author..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                    {dynamicCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                selectedCategory === category 
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Book Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {!isDataLoaded ? (
                    <div className="col-span-full text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                        <Book className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No books found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search term.</p>
                    </div>
                ) : (
                    paginatedBooks.map((book) => (
                        <div key={book.$id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group flex flex-col">
                            <div className="h-48 bg-gray-100 dark:bg-gray-750 flex flex-col items-center justify-center relative">
                                <Book className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                                <span className="absolute top-2 right-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        book.status === 'Available' && (book.copies > 0 || book.copies === undefined)
                                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                                    }`}>
                                        {book.status === 'Available' && (book.copies > 0 || book.copies === undefined) ? 'Available' : 'Issued/Out'}
                                    </span>
                                </span>
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{book.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">by {book.author}</p>
                                
                                <div className="mt-auto flex flex-col gap-3">
                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Qty: {book.copies || 1}</span>
                                        <span>{book.category}</span>
                                    </div>
                                    
                                    {cart.find(c => c.bookId === book.$id) ? (
                                        <div className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md text-sm font-medium border border-indigo-200 dark:border-indigo-800">
                                            <CheckCircle2 className="w-4 h-4" /> Added to Cart
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={() => handleAddToCart(book)}
                                            disabled={book.status !== 'Available' || book.copies === 0}
                                            className="w-full flex justify-center items-center gap-2"
                                            variant={book.status === 'Available' && (book.copies > 0 || book.copies === undefined) ? 'primary' : 'secondary'}
                                        >
                                            <BookmarkPlus className="w-4 h-4" /> 
                                            {book.status === 'Available' && (book.copies > 0 || book.copies === undefined) ? 'Add to Cart' : 'Waitlist'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Page <span className="font-medium text-gray-900 dark:text-white">{page}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 dark:text-gray-200 shadow-sm"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 dark:text-gray-200 shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-40 flex items-center justify-center"
                >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                        {cart.length}
                    </span>
                </button>
            )}

            {/* Cart Slide-over */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
                    <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
                        <div className="w-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ShoppingCart className="w-6 h-6" />
                                    Your Cart
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Your cart is empty.</p>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.bookId} className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between items-start gap-4">
                                                <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">{item.title}</h4>
                                                <button onClick={() => handleRemoveFromCart(item.bookId)} className="text-red-500 hover:text-red-700">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Qty:</span>
                                                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 px-2 py-1">
                                                    <button onClick={() => handleUpdateCartQty(item.bookId, -1)} disabled={item.qty <= 1} className="text-gray-500 hover:text-gray-700 disabled:opacity-30">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-medium w-4 text-center dark:text-white">{item.qty}</span>
                                                    <button onClick={() => handleUpdateCartQty(item.bookId, 1)} disabled={item.qty >= item.maxCopies} className="text-gray-500 hover:text-gray-700 disabled:opacity-30">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="text-xs text-gray-400">(Max: {item.maxCopies})</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {cart.length > 0 && (
                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                                    <Button onClick={handleSubmitCart} className="w-full py-3 text-lg font-medium">
                                        Final Confirmation
                                    </Button>
                                    <Button onClick={() => setIsCartOpen(false)} variant="secondary" className="w-full mt-3 py-3">
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookBrowsing;
