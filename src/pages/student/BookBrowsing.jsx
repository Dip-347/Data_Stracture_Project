import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Book, Filter, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History'];

export const BookBrowsing = () => {
    const { books, isDataLoaded, stats } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [requestSuccess, setRequestSuccess] = useState(null); // stores book ID that was successfully requested
    const itemsPerPage = 8;
    
    const [bookList, setBookList] = useState(() => books.getAll());

    useEffect(() => {
        setBookList(books.getAll());
    }, [isDataLoaded, books, stats.booksCount]);

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

    const handleRequestBook = (bookId) => {
        // Simulate a backend request for the book
        setTimeout(() => {
            setRequestSuccess(bookId);
            setTimeout(() => setRequestSuccess(null), 3000); // clear success message after 3s
        }, 500);
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
                    {CATEGORIES.map(category => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                        book.status === 'Available' 
                                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                                    }`}>
                                        {book.status}
                                    </span>
                                </span>
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{book.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">by {book.author}</p>
                                
                                <div className="mt-auto flex flex-col gap-3">
                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                                        <span>{book.category}</span>
                                    </div>
                                    
                                    {requestSuccess === book.$id ? (
                                        <div className="w-full flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-sm font-medium border border-green-200 dark:border-green-800">
                                            <CheckCircle2 className="w-4 h-4" /> Requested
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={() => handleRequestBook(book.$id)}
                                            disabled={book.status !== 'Available'}
                                            className="w-full flex justify-center items-center gap-2"
                                            variant={book.status === 'Available' ? 'primary' : 'secondary'}
                                        >
                                            <BookmarkPlus className="w-4 h-4" /> 
                                            {book.status === 'Available' ? 'Request Book' : 'Waitlist'}
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
        </div>
    );
};

export default BookBrowsing;
