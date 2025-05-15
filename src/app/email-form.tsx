"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid format"),
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
        <div className="flex sm:flex-row items-center p-2 rounded-full shadow-md border-2 bg-background border-white/40">
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
            variant="default"
            className="flex gap-1 pr-0 rounded-full sm:w-auto border-2 hover:border-primary/70 border-primary text-primary-foreground dark:bg-brand dark:hover:bg-brand/90"
            disabled={form.formState.isSubmitting}
          >
            <span className="inline-block mr-2">Talk to us</span>
            {form.formState.isSubmitting ? (
              <Loader size={15} className="animate-spin" />
            ) : (
              <Avatar>
                <AvatarImage src="https://github.com/florianmartens.png" />
                <AvatarFallback>FM</AvatarFallback>
              </Avatar>
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
