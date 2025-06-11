"use client";

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { scroller } from 'react-scroll';
import { z } from 'zod'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import validateFields from '@/lib/validate_fields'
import axios from 'axios'
import PredictionResults, { Prediction } from './components/predictions'
import { RefreshCcw } from 'lucide-react';


const formSchema = z.object({
    company: z.string().min(1, "Company Name shouldn't be empty").max(20, "Company name shouldn't be greater than 20 characters"),
    fuel: z.string().min(1, "Fuel Value shouldn't be empty").max(10, "Fuel value shouldn't be greater than 10 characters"),
    transmission: z.string().min(1, "Transmission Value shouldn't be empty").max(15, "Transmission value shouldn't be greater than 15 characters"),
    price: z.string().regex(/^\d{1,8}$/, {
        message: "Price must be a numeric value between 1 & 8 digits.",
    }),
    year: z.string().max(4, "Year should be greater than 4 digits").regex(/^\d{4}$/, {
        message: "Please enter a valid 10-digit Year.",
    })
})

type FormSchema = z.infer<typeof formSchema>
export default function VehicleRecommendation() {
    const [isPending, startTransition] = useTransition()
    const [predictions, setPredictions] = useState<Array<Prediction>>([]);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company: "",
            fuel: "",
            transmission: "",
            price: "",
            year: ""
        }
    })

    async function onSubmit(values: FormSchema) {
        startTransition(async function () {
            const validatedFields = validateFields(values, formSchema)
            const payload = {
                ...validatedFields,
                price: Number(validatedFields.price),
                year: Number(validatedFields.year),
            }
            const response = await axios.post(process.env.NEXT_PUBLIC_ML_MODEL_URL!, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response)
            setPredictions(response.data.Success.prediction)
            scroller.scrollTo('recommendations', {
                duration: 800,
                delay: 0,
                smooth: 'easeInOutQuart',
            });
        })

    }

    const fuelType: Array<string> = ["Hybrid", "Electric", "Gasoline", "Diesel"];
    const transmissionType: Array<string> = ["Automatic", "Manual"];
    const companyNames: Array<string> = [
        "Aston Martin",
        "Audi",
        "BMW",
        "Bentley",
        "Bugatti",
        "Chevrolet",
        "Chevy",
        "Chrysler",
        "Ferrari",
        "Fiat",
        "Ford",
        "Honda",
        "Hyundai",
        "Jaguar",
        "Kia",
        "Lamborghini",
        "Land Rover",
        "Maserati",
        "Mazda",
        "McLaren",
        "Mercedes",
        "Mercedes-Benz",
        "Nissan",
        "Porsche",
        "Rolls-Royce",
        "Subaru",
        "Tesla",
        "Toyota",
        "Volkswagen"
    ];
    return (
        <section className=' h-dvh w-full p-5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  md:w-[70dvw] mx-auto bg-stone-100 p-3 rounded-md mt-[12dvh] shadow-xl">
                    <div className='mb-8 w-[70%] '>
                        <h1 className='text-3xl font-bold my-3 md:ml-5'>Vehicle Recommendation</h1>
                        <p className=' text-pretty text-sm'>fill the following form and submit details to get a personalized recommendation for car</p>
                    </div>
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value: string) => field.onChange(value)} // Explicitly set the value
                                        disabled={isPending}
                                    >
                                        <SelectTrigger className="bg-neutral-50 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800 w-full ">
                                            <SelectValue placeholder="Select company name" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companyNames.map((option: string, index: number) => (
                                                <SelectItem key={index} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <FormField
                            control={form.control}
                            name="fuel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fuel Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value: string) => field.onChange(value)} // Explicitly set the value
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="bg-neutral-50 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800 w-full ">
                                                <SelectValue placeholder="Select fuel type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fuelType.map((option: string, index: number) => (
                                                    <SelectItem key={index} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="transmission"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transmission</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value: string) => field.onChange(value)} // Explicitly set the value
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="bg-neutral-50 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800 w-full">
                                                <SelectValue placeholder="Select transmission type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {transmissionType.map((option: string, index: number) => (
                                                    <SelectItem key={index} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                            <Input placeholder="e.g. $ 140000"
                                                disabled={isPending}
                                                {...field} className="bg-neutral-50 border-neutral-300" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 2010, 2014"
                                            disabled={isPending}
                                            {...field} className="bg-neutral-50 border-neutral-300" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className='flex  items-center justify-between'>

                        <Button
                            type="reset"
                            disabled={isPending}
                            variant={"default"}
                            onClick={() => form.reset()}
                            size={"icon"}
                            className='p-0 rounded-full'
                        >

                            <RefreshCcw />
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            size={"lg"}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 w-full md:w-auto"
                        >
                            {isPending ? "Loading..." : "Get Recommendation"}
                        </Button>
                    </div>
                </form>
            </Form>


            <div id='recommendations'>
                {
                    predictions.length > 0 && (
                        <PredictionResults predictions={predictions} />
                    )
                }
            </div>
        </section>
    )
}
