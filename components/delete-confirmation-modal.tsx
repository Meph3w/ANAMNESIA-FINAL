'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  itemTitle: string | null;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  setIsOpen,
  itemTitle,
  onConfirmDelete,
  isDeleting
}: DeleteConfirmationModalProps) {

  const handleOpenChange = (open: boolean) => {
    if (!isDeleting) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deletar item</DialogTitle>
          <DialogDescription>
            Apagar para sempre &ldquo;{itemTitle || 'this item'}&rdquo;? Isso não pode ser desfeito.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deletando..." : "Deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 