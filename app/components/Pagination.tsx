export default function Pagination() {
    return (
        <div className="flex justify-center space-x-2 mt-4">
            {
                [1,2,3,4,5].map((page) => (
                    <button key={page} className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {page}
                    </button>
                ))
            }'
        </div>
    );
}
