import { LibraryTable } from '@/components/library/LibraryTable';

export default function LibraryPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <h2 className="text-3xl font-bold tracking-tight">Vocabulary &amp; Grammar Library</h2>
            <LibraryTable />
        </div>
    );
}
