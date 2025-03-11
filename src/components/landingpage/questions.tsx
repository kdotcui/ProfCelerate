import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  question: String;
  answer: String;
}

const faqData: FAQItem[] = [
  {
    question: "Example1 Question How is this done?",
    answer: "Yes. Example Question How is this done?Example Question How is this done?"
  },
  {
    question: "Example2 Question How is this done?",
    answer: "Yes. Example Question How is this done?Example Question How is this done?"
  },
  {
    question: "Example3 Question How is this done?",
    answer: "Yes. Example Question How is this done?Example Question How is this done?"
  },
]


export const Questions: React.FC = () => {
  return (
    <div className="flex flex-col px-4 py-8">
      <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-normal items-center text-center">
        Questions
      </h1>
      <Accordion type="single" className="px-20" collapsible>
        {faqData.map((item,index) => (
          <AccordionItem value={`item-${index}`} className="hover:bg-zinc-100 data-[state=open]:bg-zinc-100">
            <AccordionTrigger className="text-xl font-semibold">{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

    </div>

  )
}