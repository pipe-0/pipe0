"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Ungütiges Email Format"),
  prot: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function EmailForm() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      prot: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (values.prot) {
      form.reset();
      return;
    }
    try {
      await fetch(
        "https://email-forward-worker.florian-martens22.workers.dev",
        {
          method: "POST",
          body: JSON.stringify({
            ...values,
            sender: "pipe0",
            kind: "customerRequest",
          }),
        }
      );
      console.log("here");
      form.reset();
      toast({
        title: "Success",
        description:
          "We received your request and will be in touch within the next hours.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex sm:flex-row items-center p-2 rounded-full border-2 border-white/40 bg-white/5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-grow bg-transparent text-lg placeholder:text-white/50">
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Business email"
                    className="text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="font-normal text-black rounded-full sm:w-auto bg-green-200 hover:bg-green-300"
            disabled={form.formState.isSubmitting}
          >
            Request Access
            {form.formState.isSubmitting ? (
              <Loader size={15} className="animate-spin" />
            ) : (
              <ArrowRight size={15} className="" />
            )}
          </Button>
        </div>
        <Input
          type="prot"
          placeholder="First name"
          className="invisible basis-0 w-[1px]"
        />
      </form>
    </Form>
  );
}
