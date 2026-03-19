<?php

#[Route('/a')]
class Service
{
    use LoggerTrait, CacheTrait;

    #[Inject(name: 'db')]
    public function run(#[Tag('x')] $x)
    {
        return foo(name: $x, count: 1);
    }
}
