CREATE POLICY "Authenticated users can delete captured data"
ON public.captured_data
FOR DELETE
USING (true);