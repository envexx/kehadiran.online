"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Trash, WarningCircle } from "phosphor-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
  error?: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Data",
  description = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  itemName,
  isLoading = false,
  error,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }} size="sm">
      <ModalContent>
        {() => (
          <>
            <ModalBody className="pt-6 pb-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                <WarningCircle size={32} className="text-red-500" weight="fill" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              {itemName && (
                <div className="bg-gray-50 rounded-xl px-4 py-2.5 mt-2">
                  <p className="text-sm font-medium text-gray-700">{itemName}</p>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">{description}</p>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mt-2">
                  {error}
                </div>
              )}
            </ModalBody>
            <ModalFooter className="justify-center gap-3 pb-6">
              <Button
                variant="bordered"
                className="border-gray-200 min-w-[100px]"
                onPress={onClose}
                isDisabled={isLoading}
              >
                Batal
              </Button>
              <Button
                color="danger"
                className="min-w-[100px] font-medium"
                startContent={!isLoading && <Trash size={16} />}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
