import { AiOutlineCheck } from "react-icons/ai";
import { AnimatePresence, motion } from "motion/react";

type CheckboxProps = {
    label?: string;
    checked: boolean; // artık controlled
    onChange?: (checked: boolean) => void;
};

export default function AnimatedCheckbox({ label, checked, onChange }: CheckboxProps) {
    const toggle = () => {
        onChange?.(!checked);
    };

    return (
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={toggle}>
            <div className="w-6 h-6 border-2 border-stone-400 rounded flex items-center justify-center relative">
                <AnimatePresence>
                    {checked && (
                        <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="absolute inset-0 flex items-center justify-center bg-blue-500 text-stone-50 rounded"
                        >
                            <AiOutlineCheck size={12} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {label && <span>{label}</span>}
        </div>
    );
}
