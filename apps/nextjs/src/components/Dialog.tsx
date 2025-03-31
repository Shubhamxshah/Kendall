'use client';

import { Button } from '@repo/ui/components/base/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/base/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@repo/ui/components/base/form';
import { Input } from '@repo/ui/components/base/input';
import { Label } from '@repo/ui/components/base/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";

interface DialogProps {
  name: string;
  description: string;
  url: string;
  title: string;
  buttonVariant: "outline" | "default";
}

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'username must be atleast 2 characters long',
    })
    .max(20),
  password: z
    .string()
    .min(2, {
      message: 'password must be atleast 2 characters long',
    })
    .max(20),
});

export function DialogDemo({ name, description, url, title, buttonVariant }: DialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    axios.post(url, values).then((res) => console.log(res)).catch((e) => console.log(e))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>{name}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4"> */}
        {/*   <div className="grid grid-cols-4 items-center gap-4"> */}
        {/*     <Label htmlFor="name" className="text-right"> */}
        {/*       Name */}
        {/*     </Label> */}
        {/*     <Input id="name" value="Pedro Duarte" className="col-span-3" /> */}
        {/*   </div> */}
        {/*   <div className="grid grid-cols-4 items-center gap-4"> */}
        {/*     <Label htmlFor="username" className="text-right"> */}
        {/*       Username */}
        {/*     </Label> */}
        {/*     <Input id="username" value="@peduarte" className="col-span-3" /> */}
        {/*   </div> */}
        {/* </div> */}

        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Username </FormLabel>
                    <FormControl>
                      <Input placeholder="Tom.." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Password </FormLabel>
                    <FormControl>
                      <Input placeholder="xxx.." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
