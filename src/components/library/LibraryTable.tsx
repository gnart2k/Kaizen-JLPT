'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { libraryItems } from '@/lib/data';
import type { LibraryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ExplanationDialog } from './ExplanationDialog';

const getBadgeVariant = (status: LibraryItem['status']) => {
    switch (status) {
        case 'Mastered': return 'default';
        case 'To Review': return 'secondary';
        case 'New': return 'outline';
        default: return 'default';
    }
};

export function LibraryTable() {
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

    const filteredItems = libraryItems.filter(item => 
        item.item.toLowerCase().includes(search.toLowerCase()) ||
        item.meaning.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="py-4">
                <Input 
                    placeholder="Search library..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm rounded-lg"
                />
            </div>
            <div className="rounded-2xl border shadow-md bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Meaning</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium font-headline">{item.item}</TableCell>
                                <TableCell>{item.meaning}</TableCell>
                                <TableCell>{item.level}</TableCell>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                        Explain
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {selectedItem && (
                <ExplanationDialog 
                    item={selectedItem}
                    open={!!selectedItem}
                    onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}
                />
            )}
        </>
    );
}
