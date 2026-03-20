<?php

trait LoggerA
{
    public function log()
    {
        echo "A";
    }
}

trait LoggerB
{
    public function log()
    {
        echo "B";
    }
}

class Service
{
    use LoggerA, LoggerB {
        LoggerA::log insteadof LoggerB;
        LoggerB::log as private logFromB;
    }
}

enum Status: string
{
    case Open = 'open';
    case Closed = 'closed';
}
